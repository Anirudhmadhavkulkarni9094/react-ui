// components/ui/TimeSlotGroup.tsx
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type TimeSlotGroupProps = {
  startTime?: string; // e.g. "09:00"
  endTime?: string;   // e.g. "18:00"
  interval?: number;  // minutes gap (default 30)
  value?: string;
  onChange?: (time: string) => void;
  disabledSlots?: string[];
  theme?: "light" | "dark";
  format?: "12hr" | "24hr"; // 👈 NEW
};

// helper: convert "HH:mm" to Date
const parseTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// helper: format Date → string
const formatTime = (date: Date, format: "12hr" | "24hr") => {
  if (format === "24hr") {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
};

export default function TimeSlotGroup({
  startTime = "09:00",
  endTime = "18:00",
  interval = 30,
  value,
  onChange,
  disabledSlots = [],
  theme = "light",
  format = "12hr",
}: TimeSlotGroupProps) {
  const [selected, setSelected] = useState<string | undefined>(value);

  // generate slots
  const slots = useMemo(() => {
    const slotsArray: string[] = [];
    let current = parseTime(startTime);
    const end = parseTime(endTime);

    while (current <= end) {
      slotsArray.push(formatTime(new Date(current), format));
      current.setMinutes(current.getMinutes() + interval);
    }

    return slotsArray;
  }, [startTime, endTime, interval, format]);

  const handleSelect = (time: string) => {
    setSelected(time);
    onChange?.(time);
  };

  return (
    <div className="grid grid-cols-3 gap-3"> {/* 👈 fixed 3 columns */}
      {slots.map((time) => {
        const isDisabled = disabledSlots.includes(time);
        const isSelected = selected === time;

        const baseStyles =
          "px-4 py-2 rounded-xl text-sm font-medium border transition-all";

        const lightStyles = cn(
          baseStyles,
          isSelected
            ? "bg-[#018BB5] text-white border-[#018BB5]"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
          isDisabled && "opacity-50 cursor-not-allowed hover:bg-white"
        );

        const darkStyles = cn(
          baseStyles,
          isSelected
            ? "bg-[#018BB5] text-white border-[#018BB5]"
            : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700",
          isDisabled && "opacity-50 cursor-not-allowed hover:bg-gray-800"
        );

        return (
          <button
            key={time}
            disabled={isDisabled}
            onClick={() => !isDisabled && handleSelect(time)}
            className={theme === "dark" ? darkStyles : lightStyles}
          >
            {time.toLocaleUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
