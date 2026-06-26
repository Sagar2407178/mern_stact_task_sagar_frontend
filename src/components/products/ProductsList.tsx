"use client";

import { useMemo, useCallback, useState } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { toast } from "sonner";
import { Product } from "@/store/api/productApi";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function ProductsList() {
  const { query, tableProps } = useDataTable();

  const { data, isLoading, isFetching } = useGetProductsQuery(query);
  const { data: categoriesData } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");

  const handleDelete = useCallback((id: string, name: string) => {
    setPendingDeleteId(id);
    setPendingDeleteName(name);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteProduct(pendingDeleteId).unwrap();
      toast.success("Product deleted successfully!");
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteName("");
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product.");
    }
  }, [pendingDeleteId, deleteProduct]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setPendingDeleteId(null);
    setPendingDeleteName("");
  }, []);

  const columns = useMemo(
    () => getColumns({ onDelete: handleDelete }),
    [handleDelete],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-2">
            Manage your inventory and product catalog.
          </p>
        </div>

        <Button
          render={<NextLink href="/products/add" />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          nativeButton={false}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <DataTable
        {...tableProps}
        columns={columns}
        data={data?.data.products || []}
        pageCount={data?.data.totalPages || 0}
        totalRecords={data?.data.total || 0}
        isLoading={isLoading || isFetching}
        searchPlaceholder="Search products..."
        filters={[
          {
            id: "categoryIds__in",
            label: "Category",
            options:
              categoriesData?.data.map((cat) => ({
                label: cat.name,
                value: cat.id,
              })) || [],
          },
        ]}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        productName={pendingDeleteName}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
