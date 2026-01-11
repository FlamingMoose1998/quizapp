import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


/**
 * Returns the UTC date in the format YYYYMMDD_HHmmss
 * @param {Date} [dt=new Date()] - optional Date object, defaults to now
 * @returns UTC Datetime string
 */
export function getDateTimeString(dt = new Date()) {
  return dt
    .toISOString()
    .replace(/[-:]|(\..*)/g, '')
    .replace(/T/, '_');
}