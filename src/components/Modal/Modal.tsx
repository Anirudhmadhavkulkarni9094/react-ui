// components/ui/Modal.tsx
import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  theme?: "light" | "dark"; // 👈 new
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  theme = "light",
}: ModalProps) {
  if (!isOpen) return null;

  const containerStyles =
    theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";

  const borderStyles = theme === "dark" ? "border-gray-700" : "border-gray-200";

  const footerBg = theme === "dark" ? "bg-gray-800" : "bg-gray-50";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Wrapper */}
      <div className="w-full h-full flex items-end sm:items-center justify-center">
        <div
          className={cn(
            "rounded-t-2xl sm:rounded-2xl shadow-lg w-full sm:max-w-md h-[90%] sm:h-auto flex flex-col",
            containerStyles
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "relative p-4 flex items-center justify-between border-b",
              borderStyles
            )}
          >
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className={cn("border-t p-4", borderStyles, footerBg)}>
              <div className="flex justify-end gap-2">{footer}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
