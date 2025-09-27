// components/ui/RadioButton.tsx
import { cn } from "@/lib/utils";

type RadioButtonProps = {
  label?: string;
  name: string; // group name
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  theme?: "light" | "dark";
  className?: string;
};

export default function RadioButton({
  label,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  error,
  theme = "light",
  className,
}: RadioButtonProps) {
  const baseStyles =
    "w-5 h-5 flex items-center justify-center rounded-full border transition-all";

  const lightStyles = cn(
    baseStyles,
    checked
      ? "border-[#018BB5] bg-[#018BB5] ring-2 ring-[#018BB5]"
      : "border-gray-300 bg-white hover:bg-gray-50",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-red-500 ring-red-500"
  );

  const darkStyles = cn(
    baseStyles,
    checked
      ? "border-[#018BB5] bg-[#018BB5] ring-2 ring-[#018BB5]"
      : "border-gray-600 bg-gray-800 hover:bg-gray-700",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-red-500 ring-red-500"
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
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className="hidden"
      />

      <div className={theme === "dark" ? darkStyles : lightStyles}>
        {checked && (
          <div className="w-2.5 h-2.5 bg-white rounded-full" /> // inner dot
        )}
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
