"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { toast } from "sonner";
import {
  Product,
  useUpdateProductMutation,
  useGetProductQuery,
} from "@/store/api/productApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface EditProductProps {
  productId: string;
}

export function EditProduct({ productId }: EditProductProps) {
  const router = useRouter();

  const { data: productData, isLoading: isFetching } = useGetProductQuery(
    productId,
    {
      skip: !productId,
    },
  );

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleUpdateSubmit = async (
    data: Partial<Product> & { categoryIds?: string[] },
  ) => {
    try {
      await updateProduct({ id: productId, ...data }).unwrap();
      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error(
        (err as unknown as { data: { message: string } })?.data?.message ||
          "Failed to update product",
      );
    }
  };

  const product = productData?.data;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground mt-2">
            Update your product details.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        {isFetching ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : product ? (
          <ProductForm
            initialData={product}
            onSubmit={handleUpdateSubmit}
            isLoading={isUpdating}
          />
        ) : (
          <div className="text-center text-muted-foreground py-10">
            Product not found.
          </div>
        )}
      </div>
    </div>
  );
}
