import { useMutation, useQueryClient } from "@tanstack/react-query";





export const updateCartQtyApi = () => {
    const queryCLient = useQueryClient()
  return useMutation({
    mutationKey: [`mutate_update_cart_qty`],
    mutationFn: async ({ id, qty }: { id: number; qty: number }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://app.beewave.ng/api/cart?id=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({quantity: qty}),
      });

      if(!res.ok) return "Error";

      
      return res.json()      

    },

    onSuccess: ()=>{
        queryCLient.invalidateQueries({ queryKey: [`get_cart_items`]})
    }

  });
};
