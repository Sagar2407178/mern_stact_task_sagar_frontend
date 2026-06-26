"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { ListFilter, Filter, CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type FilterType = "multi-select" | "single-select" | "text" | "date";

export interface DataTableFilter {
  id: string;
  label: string;
  type?: FilterType; // Defaults to 'multi-select'
  options?: { label: string; value: string }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  toolbarActions?: React.ReactNode;
  filters?: DataTableFilter[];
  filterValues?: Record<string, string[]>;
  onFilterChange?: (id: string, values: string[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortingChange,
  isLoading,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  toolbarActions,
  filters,
  filterValues,
  onFilterChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    manualSorting: true,
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  const [localSearch, setLocalSearch] = useState(searchValue ?? "");

  useEffect(() => {
    setLocalSearch(searchValue ?? "");
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearch !== (searchValue ?? "")) {
        onSearchChange(localSearch);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center py-4 gap-2">
        {onSearchChange && (
          <Input
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="max-w-sm"
          />
        )}

        <div className="flex items-center gap-2 ml-auto">
          {toolbarActions}

          {/* Generic Filters */}
          {filters?.map((filter, index) => {
            const selectedValues = filterValues?.[filter.id] || [];
            const filterType = filter.type || "multi-select";

            if (filterType === "date") {
              const dateValue = selectedValues[0]
                ? new Date(selectedValues[0])
                : undefined;
              return (
                <Popover key={index}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className={cn(
                          "ml-auto justify-start text-left font-normal border-dashed",
                          !dateValue && "text-muted-foreground",
                        )}
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.label}
                    {dateValue && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {format(dateValue, "PPP")}
                        </Badge>
                      </>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) => {
                        onFilterChange?.(
                          filter.id,
                          date ? [date.toISOString()] : [],
                        );
                      }}
                    />
                  </PopoverContent>
                </Popover>
              );
            }

            if (filterType === "text") {
              return (
                <Popover key={index}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="ml-auto border-dashed"
                      />
                    }
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {filter.label}
                    {selectedValues[0] && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {selectedValues[0]}
                        </Badge>
                      </>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-60" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        Filter by {filter.label}
                      </h4>
                      <Input
                        placeholder={`Enter ${filter.label.toLowerCase()}...`}
                        value={selectedValues[0] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onFilterChange?.(filter.id, val ? [val] : []);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <Popover key={index}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className="ml-auto border-dashed"
                    />
                  }
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filter.label}
                  {selectedValues.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal lg:hidden"
                      >
                        {selectedValues.length}
                      </Badge>
                      <div className="hidden space-x-1 lg:flex">
                        {selectedValues.length > 2 &&
                        filterType === "multi-select" ? (
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal"
                          >
                            {selectedValues.length} selected
                          </Badge>
                        ) : (
                          filter.options
                            ?.filter((option) =>
                              selectedValues.includes(option.value),
                            )
                            .map((option) => (
                              <Badge
                                variant="secondary"
                                key={option.value}
                                className="rounded-sm px-1 font-normal"
                              >
                                {option.label}
                              </Badge>
                            ))
                        )}
                      </div>
                    </>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={filter.label} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filter.options?.map((option) => {
                          const isSelected = selectedValues.includes(
                            option.value,
                          );
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => {
                                if (filterType === "single-select") {
                                  onFilterChange?.(
                                    filter.id,
                                    isSelected ? [] : [option.value],
                                  );
                                } else {
                                  const newValues = isSelected
                                    ? selectedValues.filter(
                                        (v) => v !== option.value,
                                      )
                                    : [...selectedValues, option.value];
                                  onFilterChange?.(filter.id, newValues);
                                }
                              }}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible",
                                )}
                              >
                                <Check className={cn("h-4 w-4")} />
                              </div>
                              <span>{option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      {selectedValues.length > 0 && (
                        <>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => onFilterChange?.(filter.id, [])}
                              className="justify-center text-center"
                            >
                              Clear filters
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalRecords > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, totalRecords)} of{" "}
            {totalRecords} row(s).
          </div>
          <div className="flex items-center space-x-2">
            {/* Generic Limit Dropdown */}
            {onPageSizeChange && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="sm" />}
                >
                  <ListFilter className="w-4 h-4 mr-2" />
                  {pageSize} / page
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuRadioGroup
                    value={pageSize.toString()}
                    onValueChange={(val) => {
                      onPageSizeChange(Number(val));
                    }}
                  >
                    <DropdownMenuRadioItem
                      value="10"
                      className="cursor-pointer"
                    >
                      10
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="20"
                      className="cursor-pointer"
                    >
                      20
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="50"
                      className="cursor-pointer"
                    >
                      50
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <Button
                  key={i}
                  variant={pageIndex === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(i)}
                  className={
                    pageIndex === i
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white w-8 h-8 p-0"
                      : "w-8 h-8 p-0"
                  }
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
