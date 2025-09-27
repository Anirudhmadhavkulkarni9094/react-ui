// components/ui/Dropdown.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  theme?: "light" | "dark";
  className?: string;
};

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  theme = "light",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const baseStyles =
    "w-full rounded-xl border px-3 py-2 flex items-center justify-between cursor-pointer transition";

  const lightStyles = cn(
    baseStyles,
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    disabled && "opacity-50 cursor-not-allowed"
  );

  const darkStyles = cn(
    baseStyles,
    "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700",
    disabled && "opacity-50 cursor-not-allowed"
  );

  return (
    <div className={cn("flex flex-col gap-1 relative", className)} ref={ref}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        className={theme === "dark" ? darkStyles : lightStyles}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          size={18}
          className={cn(
            "transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </div>

      {/* Options */}
      {open && (
        <div
          className={cn(
            "absolute top-full left-0 w-full mt-1 rounded-xl shadow-lg border z-10 overflow-hidden",
            theme === "dark"
              ? "bg-gray-800 border-gray-600 text-gray-200"
              : "bg-white border-gray-200 text-gray-700"
          )}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                opt.value === value &&
                  "bg-[#018BB5] text-white hover:bg-[#017A9F]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
