// utils/dobUtils.ts

// Generate list of days
export const getDays = () => Array.from({ length: 31 }, (_, i) => i + 1);

// Generate list of months
export const getMonths = () => [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate list of years from current year down to 1900
export const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
};

// Validate full DOB object
export const validateDOB = (day?: string, month?: string, year?: string) => {
  if (!day) return { field: "dobDay", error: "Day is required" };
  if (!month) return { field: "dobMonth", error: "Month is required" };
  if (!year) return { field: "dobYear", error: "Year is required" };

  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return { field: "dobDay", error: "Invalid date" };
  }

  return null;
};
