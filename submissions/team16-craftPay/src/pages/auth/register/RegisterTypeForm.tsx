import { Link, useNavigate, useParams } from "react-router"
import { IoPersonOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5"
import { signUpFormSchema, type SignUpFormSchemaType } from "../../../schemas/signupValidationSchema";
import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail } from "react-icons/md";
import { registerUserApi } from "../../../api/authApiCalls";
import useNotification from "antd/es/notification/useNotification";

type InputFields = {
  id: number;
  name: keyof SignUpFormSchemaType;
  icon: ReactElement;
  type: string;
  placeholder: string;
  labelName: string
}

const artisanForm: InputFields[] = [
  {
    id: 1,
    name: "fname",
    icon: <IoPersonOutline />,
    type: "text",
    placeholder: "Enter your Full Name",
    labelName: "Full Name"
  },
  {
    id: 2,
    name: "email",
    icon: <MdOutlineEmail />,
    type: "text",
    placeholder: "Enter your email",
    labelName: "Email Address"
  },
  {
    id: 3,
    name: "password",
    icon: <IoLockClosedOutline />,
    type: "password",
    placeholder: "********",
    labelName: "Password"
  },
]

const buyerForm: InputFields[] = [
  {
    id: 1,
    name: "fname",
    icon: <IoPersonOutline />,
    type: "text",
    placeholder: "Enter your Full Name",
    labelName: "Full Name"
  },
  {
    id: 2,
    name: "email",
    icon: <MdOutlineEmail />,
    type: "text",
    placeholder: "Enter your email",
    labelName: "Email Address"
  },
  {
    id: 3,
    name: "password",
    icon: <IoLockClosedOutline />,
    type: "password",
    placeholder: "********",
    labelName: "Password"
  },
]

const RegisterTypeForm = () => {
  const param = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [message, contextHolder] = useNotification()

  const { handleSubmit, control, formState: { errors } } = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema)
  })

  const registerUser = async (data: SignUpFormSchemaType) => {
    console.log(data)
    setIsLoading(true)
    try {
      const res = await registerUserApi(data, param.type || "artisan")
      console.log("Success from component")



      if (res?.success == false) {
        message.error({
          message: res.msg
        })
        return;
      }

      message.success({
        message: "Signed Up Successful"
      })

      setTimeout(() => {
        navigate('/login')
      }, 500)

    } catch (e) {
      console.log(e)
      message.error({
        message: "Signup Failed. Please try again"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lg:max-w-[40%] lg:mx-auto lg:mt-18">
      {contextHolder}
      <h1 className="text-3xl font-semibold">Register as a {param.type}</h1>


      <form className="" onSubmit={handleSubmit(registerUser)}>
        <section className="mb-12">
          {param?.type === "artisan" && artisanForm.map((eachInput) => (
            <div key={eachInput.id} className="flex flex-col space-y-3 mt-6">
              <label htmlFor={eachInput.name} className="text-lg text-gray-600">{eachInput.labelName}</label>
              <Controller
                name={eachInput.name}
                control={control}
                render={({ field }) => (
                  <div className="flex space-x-3 items-center border px-3 py-2 rounded-xl border-gray-400">
                    {eachInput.icon}
                    <input {...field} type={eachInput.type} placeholder={eachInput.placeholder} name={eachInput.name} className="outline-none w-full" />
                  </div>
                )}
              />
              {errors[eachInput.name] && (
                <p className="text-red-500 text-sm">{errors[eachInput.name]?.message}</p>
              )}
            </div>

          ))}

          {param?.type === "buyer" && buyerForm.map((eachInput) => (
            <div key={eachInput.id} className="flex flex-col space-y-3 mt-6">
              <label htmlFor={eachInput.name} className="text-lg text-gray-600">{eachInput.labelName}</label>
              <Controller
                name={eachInput.name}
                control={control}
                render={({ field }) => (
                  <div className="flex space-x-3 items-center border px-3 py-2 rounded-xl border-gray-400">
                    {eachInput.icon}
                    <input {...field} type={eachInput.type} placeholder={eachInput.placeholder} name={eachInput.name} className="outline-none w-full" />
                  </div>
                )}
              />
              {errors[eachInput.name] && (
                <p className="text-red-500 text-sm">{errors[eachInput.name]?.message}</p>
              )}
            </div>
          ))}
        </section>

        <input type="submit" value={isLoading ? "Creating your account..." : "Register"} className="w-full text-center bg-[#923B10] text-white text-xl py-1 rounded-full hover:border-[0.5px] hover:border-black hover:text-black hover:bg-transparent hover:duration-200 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isLoading} />

      </form>

      <span className="flex space-x-1 justify-center items-center mt-4">
        <p>Already have an account?</p>
        <Link to='/login' className="underline text-purple-500 hover:text-purple-700">Login</Link>
      </span>

    </div>
  )
}

export default RegisterTypeForm