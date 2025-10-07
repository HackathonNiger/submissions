import z from "zod";

export const signUpFormSchema = z.object({
    fname: z.string({message: "Please enter a valid full name"}).min(5, {message: "Full name is required "}),
    email: z.email({message: "Please enter a valid email address"}),
    password: z.string({message: "Please enter a valid password"}).min(8, {message: "Password must be a minimum of 6 characters"}),
    // role: z.string()
})

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>