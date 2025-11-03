    import { useMutation, useQueryClient } from "@tanstack/react-query";

    

    export const removeItemFromCartApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [`remove_item_fromcart`],
        mutationFn: async (cartId: number) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://app.beewave.ng/api/remove-cart?id=${cartId}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return "Error";
        
        return res.json();
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`get_cart_items`] });
        },
    });
    };
