// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = classNames helper
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}
