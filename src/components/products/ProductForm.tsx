"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { Product } from "@/store/api/productApi";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Quantity must be positive"),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product> & { categoryIds?: string[] }) => void;
  isLoading: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      categoryIds: initialData?.categories?.map((c) => c.id) || [],
    },
  });

  // Reset form when initialData arrives (async fetch on edit page)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        categoryIds: initialData.categories?.map((c) => c.id) || [],
      });
    }
  }, [initialData, reset]);

  const selectedCategories = watch("categoryIds") || [];

  const handleCategoryToggle = (id: string) => {
    if (selectedCategories.includes(id)) {
      setValue(
        "categoryIds",
        selectedCategories.filter((c) => c !== id),
      );
    } else {
      setValue("categoryIds", [...selectedCategories, id]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
          Product Name
        </Label>
        <Input
          id="name"
          placeholder="e.g. Wireless Headphones"
          {...register("name")}
          className={cn(
            "bg-muted/30 transition-colors focus:bg-background",
            errors.name
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-border",
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide a detailed description of the product..."
          {...register("description")}
          className="bg-muted/30 transition-colors focus:bg-background border-border min-h-[100px] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price" className={errors.price ? "text-red-500" : ""}>
            Price ($)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
              className={cn(
                "bg-muted/30 transition-colors focus:bg-background pl-7",
                errors.price
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-border",
              )}
            />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
              {errors.price.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className={errors.stock ? "text-red-500" : ""}>
            Quantity
          </Label>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            {...register("stock", { valueAsNumber: true })}
            className={cn(
              "bg-muted/30 transition-colors focus:bg-background",
              errors.stock
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-border",
            )}
          />
          {errors.stock && (
            <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Label className={errors.categoryIds ? "text-red-500" : ""}>
          Categories
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border",
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {isSelected && <Check className="w-4 h-4" />}
                {category.name}
              </button>
            );
          })}
        </div>
        {errors.categoryIds && (
          <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
            {errors.categoryIds.message}
          </p>
        )}
      </div>

      <div className="pt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
      </div>
    </form>
  );
}
