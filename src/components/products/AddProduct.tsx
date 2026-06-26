"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { toast } from "sonner";
import { Product, useCreateProductMutation } from "@/store/api/productApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AddProduct() {
  const router = useRouter();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const handleCreateSubmit = async (
    data: Partial<Product> & { categoryIds?: string[] },
  ) => {
    try {
      await createProduct(data).unwrap();
      toast.success("Product created successfully!");
      router.push("/products");
    } catch (err: unknown) {
      console.error("Failed to create product:", err);
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

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
          <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
          <p className="text-muted-foreground mt-2">
            Create a new product for your catalog.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <ProductForm onSubmit={handleCreateSubmit} isLoading={isCreating} />
      </div>
    </div>
  );
}
