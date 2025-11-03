import z from "zod";

export const createProductFormSchema = z.object({
  title: z.string({ message: "This field is required" }),
  desc: z
    .string({ message: "This field is required" })
    .max(60, { message: "Max length is 60" }),
  price: z.number().min(500, { message: "Price must be NGN500 and above" }),
  category: z.string(),
  image_url: z.string(),
});

export type CreateProductFormSchemaType = z.infer<
  typeof createProductFormSchema
>;
