"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Title shown in the dialog heading */
  title?: string;
  /** Description shown below the title */
  description?: string;
  /** Label for the confirm button (default: "Delete") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Visual variant — currently "danger" is supported */
  variant?: "danger" | "default";
  /** @deprecated Use title + description instead */
  productName?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  productName,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  const resolvedDescription =
    description ??
    (productName
      ? `"${productName}" will be permanently deleted and cannot be recovered.`
      : "This action is permanent and cannot be undone.");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 duration-150" />

        {/* Panel */}
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl",
            "outline-none duration-150",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          )}
        >
          {/* Title */}
          <DialogPrimitive.Title className="text-base font-semibold text-white">
            {title}
          </DialogPrimitive.Title>

          {/* Description */}
          <DialogPrimitive.Description className="mt-2 text-sm text-neutral-400 leading-relaxed">
            {resolvedDescription}
          </DialogPrimitive.Description>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <DialogPrimitive.Close
              render={
                <button
                  disabled={isLoading}
                  className={cn(
                    "h-9 rounded-lg border border-neutral-700 bg-transparent px-4 text-sm font-medium text-neutral-300",
                    "transition-colors hover:bg-neutral-800 hover:text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600",
                    "disabled:pointer-events-none disabled:opacity-40",
                  )}
                />
              }
            >
              {cancelLabel}
            </DialogPrimitive.Close>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white",
                "transition-colors hover:bg-red-500",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting…
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
