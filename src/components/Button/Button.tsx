// components/ui/Button.tsx
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  theme?: "light" | "dark"; // 👈 new
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  className,
  icon,
  iconPosition = "left",
  theme = "light", // 👈 default to light mode
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant styles for light theme
  const lightVariantStyles: Record<string, string> = {
    primary: "bg-[#018BB5] text-white hover:bg-[#017A9F] focus:ring-[#018BB5]",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    outline:
      "border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  // Variant styles for dark theme
  const darkVariantStyles: Record<string, string> = {
    primary: "bg-[#018BB5] text-white hover:bg-[#017A9F] focus:ring-[#018BB5]",
    secondary:
      "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500",
    outline:
      "border border-gray-500 text-gray-100 hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        theme === "dark"
          ? darkVariantStyles[variant]
          : lightVariantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
