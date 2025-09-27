// components/ui/Loader.tsx
import { cn } from "@/lib/utils";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
};

export default function Loader({
  size = "md",
  theme = "light",
  className,
}: LoaderProps) {
  const sizeClasses: Record<string, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
  };

  const colorClasses =
    theme === "dark"
      ? "border-gray-500 border-t-white"
      : "border-gray-300 border-t-[#018BB5]";

  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeClasses[size],
        colorClasses,
        className
      )}
    />
  );
}
 