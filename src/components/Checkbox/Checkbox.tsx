// components/ui/Checkbox.tsx
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type CheckboxProps = {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  theme?: "light" | "dark";
  className?: string;
};

export default function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  error,
  theme = "light",
  className,
}: CheckboxProps) {
  const baseStyles =
    "w-5 h-5 flex items-center justify-center rounded-md border transition-all focus:outline-none focus:ring-2";

  const lightStyles = cn(
    baseStyles,
    checked
      ? "bg-[#018BB5] border-[#018BB5] text-white"
      : "bg-white border-gray-300 text-transparent hover:bg-gray-50",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-red-500 focus:ring-red-500"
  );

  const darkStyles = cn(
    baseStyles,
    checked
      ? "bg-[#018BB5] border-[#018BB5] text-white"
      : "bg-gray-800 border-gray-600 text-transparent hover:bg-gray-700",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-red-500 focus:ring-red-500"
  );

  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none text-sm",
        disabled && "cursor-not-allowed",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        required={required}
        className="hidden"
      />

      <div className={theme === "dark" ? darkStyles : lightStyles}>
        <Check size={14} strokeWidth={3} />
      </div>

      {label && (
        <span
          className={cn(
            "text-gray-700 dark:text-gray-300",
            disabled && "opacity-50"
          )}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}

      {error && <span className="text-sm text-red-500 ml-2">{error}</span>}
    </label>
  );
}
