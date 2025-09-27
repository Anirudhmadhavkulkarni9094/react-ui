import { useState } from "react";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  errorStatus?: boolean;
  className?: string;
  icon?: React.ReactNode;          
  iconPosition?: "left" | "right"; 
  required?: boolean;              
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
  error,
  errorStatus,
  className,
  icon,
  iconPosition = "left",
  required = false,
}: InputProps) {
  const [touched, setTouched] = useState(false);

  const baseStyles =
    "w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#018BB5] focus:border-[#018BB5] disabled:opacity-50 disabled:cursor-not-allowed transition-all";

  const requiredError = required && touched && !value;

  const hasError = errorStatus || requiredError;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={() => setTouched(true)}
          className={cn(
            baseStyles,
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300",
            icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
            className
          )}
        />

        {icon && iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>

      {hasError && (
        <p className="text-sm flex gap-2 items-center text-red-500">
          <CircleAlert size={16} />{" "}
          {error || `${label || "Field"} is required`}
        </p>
      )}
    </div>
  );
}
