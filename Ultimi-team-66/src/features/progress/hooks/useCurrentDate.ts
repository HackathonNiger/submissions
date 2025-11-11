// hooks/useCurrentDate.ts
export const useCurrentDate = () => {
  const currentDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\//g, "-") // Ensure YYYY-MM-DD format if needed

  return currentDate
}