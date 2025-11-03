import { useQuery } from "@tanstack/react-query"

const token = localStorage.getItem('token')

export const useGetCartItems = () => {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['get_cart_items'],
        queryFn: async () => {
            const res = await fetch('https://app.beewave.ng/api/carts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!res.ok) return "Error"

            return res.json()
        }
    })
    const cartLength = !isPending && !error && data?.cart_items ? data.cart_items.length : 0;


    return { data, cartLength, isPending, error, refetch }
}

