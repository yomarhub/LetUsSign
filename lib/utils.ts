import { User } from "@/types/api"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getName = (u: User | undefined) => u ? `${u.firstName} ${u.lastName}` : 'Undefined'