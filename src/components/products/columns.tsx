"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/store/api/productApi";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ColumnMeta {
  onDelete: (id: string, name: string) => void;
}

export const getColumns = (meta: ColumnMeta): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="w-3 h-3" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories = row.original.categories || [];
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
            >
              {cat.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center justify-end gap-1 cursor-pointer select-none hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="w-3 h-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <div className="text-right font-medium">${price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center justify-end gap-1 cursor-pointer select-none hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="w-3 h-3" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("stock")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Added On
          <ArrowUpDown className="w-3 h-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            render={<Link href={`/products/edit/${product.id}`} />}
            nativeButton={false}
          >
            <Pencil className="w-4 h-4 text-indigo-500 hover:text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => meta.onDelete(product.id, product.name)}
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
