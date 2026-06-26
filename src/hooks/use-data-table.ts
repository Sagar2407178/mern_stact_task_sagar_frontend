import { useState, useMemo } from "react";
import { SortingState } from "@tanstack/react-table";

interface UseDataTableProps {
  defaultSortBy?: string;
  defaultSortOrder?: "ASC" | "DESC";
  defaultLimit?: number;
  defaultFilters?: Record<string, string[]>;
}

export function useDataTable({
  defaultSortBy = "createdAt",
  defaultSortOrder = "DESC",
  defaultLimit = 10,
  defaultFilters = {},
}: UseDataTableProps = {}) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: defaultSortBy, desc: defaultSortOrder === "DESC" },
  ]);
  const [filters, setFilters] =
    useState<Record<string, string[]>>(defaultFilters);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder =
    sorting.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : undefined;

  const queryFilters = useMemo(() => {
    return Object.entries(filters).reduce(
      (acc, [key, values]) => {
        if (values && values.length > 0) {
          acc[key] = values.join(",");
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [filters]);

  // The query object to pass to RTK Query
  const query = useMemo(
    () => ({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      ...queryFilters,
    }),
    [page, limit, search, sortBy, sortOrder, queryFilters],
  );

  const resetPage = () => setPage(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  const handleFilterChange = (id: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [id]: values }));
    setPage(1);
  };

  // Props to spread directly onto the DataTable component
  const tableProps = {
    pageIndex: page - 1,
    pageSize: limit,
    onPageChange: (p: number) => setPage(p + 1),
    onPageSizeChange: handlePageSizeChange,
    sorting,
    onSortingChange: setSorting,
    searchValue: search,
    onSearchChange: handleSearch,
    filterValues: filters,
    onFilterChange: handleFilterChange,
  };

  return {
    query,
    tableProps,
    resetPage,
  };
}
