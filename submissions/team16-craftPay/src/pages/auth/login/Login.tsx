import { useState, type ReactElement } from "react";
import { loginFormSchema, type LoginFormSchemaType } from "../../../schemas/loginValidationSchema";
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginUserApi } from "../../../api/authApiCalls";
import useNotification from "antd/es/notification/useNotification"
import { useAuth } from "../../../context/AuthContext";



export type InputFields = {
  id: number;
  name: keyof LoginFormSchemaType;
  icon: ReactElement;
  type: string;
  placeholder: string;
  labelName: string
}

const inputFields: InputFields[] = [
  {
    id: 1,
    name: "email",
    icon: <MdOutlineEmail />,
    type: "text",
    placeholder: "Enter your email",
    labelName: "Email Address"
  },
  {
    id: 2,
    name: "password",
    icon: <IoLockClosedOutline />,
    type: "password",
    placeholder: "********",
    labelName: "Password"
  },
]
const Login = () => {
  const navigate = useNavigate()

  const { handleSubmit, control, formState: { errors } } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema)
  })

  const [message, context] = useNotification()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {login} = useAuth()

  const handleLogin = async (data: LoginFormSchemaType) => {
    console.log(data)
    setIsLoading(true)

    try {
      const res = await loginUserApi(data)
      console.log("Success from component")



      if (res?.success === false) {
        message.error({
          message: res.msg
        })
        return;
      }

      login(res.msg?.token, res.msg?.user?.role)

      message.success({
        message: "Login Successful"
      })

      setTimeout(()=>{
        navigate('/')
      }, 500)

    } catch (e) {
      console.log(e)
      message.error({
        message: "Login Failed. Please try again"
      })
    }finally{
      setIsLoading(false)
    }
  }


  return (
    <main className="lg:mt-32 lg:max-w-[50%] lg:mx-auto">
      {context}
      <h1 className="text-3xl font-semibold">Welcome Back!</h1>

      <form className="" onSubmit={handleSubmit(handleLogin)}>
        <section className="mb-12">
          {inputFields.map((eachInput) => (
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
        <input type="submit" value={`${isLoading ? "Logging in..." : "Login"}`} className={`w-full text-center bg-[#923B10] text-white text-xl py-1 rounded-full hover:border-[0.5px] hover:border-black hover:text-black hover:bg-transparent hover:duration-200 transition-all cursor-pointer disabled:bg-gray-400`} disabled={isLoading}/>
      </form>

      <span className="flex space-x-1 justify-center items-center mt-4">
        <p>Don't have an account yet?</p>
        <Link to='/register' className="underline text-purple-500 hover:text-purple-700">Register</Link>
      </span>


    </main>
  )
}

export default Login