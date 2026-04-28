import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function buildWhatsAppURL(phone: string, text: string) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export function normalizeSearch(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}
