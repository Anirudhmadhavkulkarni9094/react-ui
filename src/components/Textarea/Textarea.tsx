// components/ui/Textarea.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  rows?: number;
  theme?: "light" | "dark";
  className?: string;
};

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  rows = 4,
  theme = "light",
  className,
}: TextareaProps) {
  const [touched, setTouched] = useState(false);

  const baseStyles =
    "w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all";

  const lightStyles = cn(
    baseStyles,
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#018BB5] focus:border-[#018BB5]",
    "bg-white text-gray-900"
  );

  const darkStyles = cn(
    baseStyles,
    error ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-[#018BB5] focus:border-[#018BB5]",
    "bg-gray-800 text-gray-200"
  );

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onBlur={() => setTouched(true)}
        className={cn(theme === "dark" ? darkStyles : lightStyles, className)}
      />

      {error && (
        <p className="text-sm flex gap-2 items-center text-red-500">
          <CircleAlert size={16} /> {error}
        </p>
      )}
    </div>
  );
}
