
import type { ItemToCartInfo } from "../../pages/Items/ItemPreview";



export const pushCartData = async (data: ItemToCartInfo | null) => {
  try {
  const token = localStorage.getItem("token");
    const res = await fetch("https://app.beewave.ng/api/cart", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) return {
        success: false,
        msg: "Something Went Worng. Try again",
      }; ;

    const val = await res.json();

    if (val.success === false) {
      return {
        success: false,
        msg: val.msg || "Something Went Worng. Try again",
      };
    }

    return {
        success: true,
        msg: val.msg || "Successful"
    }
  } catch (e) {
    console.error(e);
    return { success: false, msg: "Something Went Worng. Try again" };
  }
};
