import z from "zod";

export const loginFormSchema = z.object({
    email: z.email({message: "Please enter a valid email address."}),
    password: z.string({message: "Please enter a valid password"}).min(8, {message: "Password must be a minimum of 8 characters"})
})

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>