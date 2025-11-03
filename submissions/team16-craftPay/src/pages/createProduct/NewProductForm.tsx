import type { ReactElement } from "react";
import type { CreateProductFormSchemaType } from "../../schemas/createProductFormSchema";

export type InputFields = {
  id: number;
  name: keyof CreateProductFormSchemaType;
  type: string;
  placeholder: string;
  labelName: string
}

const inputFields: InputFields[] = [
  {
    id: 1,
    name: "title",
    type: "text",
    placeholder: "e.g. Clean wooven laundry basket",
    labelName: "Product Title"
  },
  {
    id: 2,
    name: "desc",
    type: "text",
    placeholder: "Enter a text",
    labelName: "Description"
  },
  {
    id: 2,
    name: "desc",
    type: "text",
    placeholder: "Enter a text",
    labelName: "Description"
  },
  {
    id: 2,
    name: "desc",
    type: "text",
    placeholder: "Enter a text",
    labelName: "Description"
  },
]

const NewProductForm = () => {

  return (
    <main>
        <h1 className="font-semibold">The world deserve to see your masterpiece!🚀</h1>

        <form>

        </form>
    </main>
  )
}

export default NewProductForm