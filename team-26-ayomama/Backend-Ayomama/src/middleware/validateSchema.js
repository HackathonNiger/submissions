// import z from "zod";

// // Emergency Contact
// const emergencyContactSchema = z.object({
//   name: z.string().optional(),
//   phone: z.string().optional(),
//   email: z.email("Invalid email").optional(),
//   relationship: z.string().optional(),
// });

// // ====================== USER ======================
// export const registerSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   phone: z.string().optional(),
//   lastPeriodDate: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
//     .optional()
//     .or(z.literal("")),
//   address: z.string().optional(),
//   preferredLanguages: z.enum(["en", "yo", "ig", "ha"]).optional(),
//   emergencyContact: z.array(emergencyContactSchema).optional(),
// });

// export const loginSchema = z.object({
//   email: z.email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// export const profileUpdateSchema = registerSchema.partial();

// export const updateLanguageSchema = z.object({
//   preferredLanguages: z.enum(["en", "yo", "ig", "ha"]),
// });

// // ====================== CHAT ======================
// export const chatSchema = z.object({
//   content: z
//     .string()
//     .min(1, "Message content is required")
//     .max(1000, "Message is too long"),
// });

// // ====================== VISIT ======================
// export const createVisitSchema = z.object({
//   visitDate: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
//   visitTime: z
//     .string()
//     .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
//   duration: z.number().int().positive().optional(),
//   notes: z.string().optional(),
//   hospitalName: z.string().min(1, "Hospital name is required"),
//   doctorName: z.string().min(1, "Doctor name is required"),
// });

// // For PATCH/PUT (update) -> allow partial fields
// export const updateVisitSchema = createVisitSchema.partial();
