// components/ui/Badge.tsx
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  theme?: "light" | "dark";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  theme = "light",
  className,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all";

  const lightVariants: Record<string, string> = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  const darkVariants: Record<string, string> = {
    default: "bg-gray-700 text-gray-100",
    success: "bg-green-700 text-green-100",
    warning: "bg-yellow-700 text-yellow-100",
    danger: "bg-red-700 text-red-100",
    info: "bg-blue-700 text-blue-100",
  };

  return (
    <span
      className={cn(
        baseStyles,
        theme === "dark" ? darkVariants[variant] : lightVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
