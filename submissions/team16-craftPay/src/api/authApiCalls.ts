import type { LoginFormSchemaType } from "../schemas/loginValidationSchema";
import type { SignUpFormSchemaType } from "../schemas/signupValidationSchema";

export const loginUserApi = async (data: LoginFormSchemaType) => {
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { success: false, msg: "Something Went Worng. Try again" };
    }

    const val = await res.json();

    if (val.success === false) {
      return {
        success: false,
        msg: val.msg || "Something Went Worng. Try again",
      };
    }

    // localStorage.setItem("token", val?.token);
   
    return { success: true, msg: val };
  } catch (e) {
    console.error(e);
    return { success: false, msg: "Something Went Worng. Try again" };
  }
};

export const registerUserApi = async (
  data: SignUpFormSchemaType,
  userRole: string
) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/signup.php`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: data.fname,
        email: data.email,
        password: data.password,
        role: userRole,
      }),
    });

    if (!res.ok) {
      return { success: false, msg: "Something Went Worng. Try again" };
    }

    const val = await res.json();
    console.log(val);

    if (val.success === false) {
      return {
        success: false,
        msg: val.msg || "Something Went Worng. Try again",
      };
    }
  } catch (e) {
    console.error(e);
    return { success: false, msg: "Something Went Worng. Try again" };
  }
};
