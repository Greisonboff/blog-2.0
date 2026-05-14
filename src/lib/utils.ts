import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultAvatar =
  "https://res.cloudinary.com/dtfpzkwpz/image/upload/v1778033342/296fe121-5dfa-43f4-98b5-db50019738a7_cjpic2.jpg";
