import { useQuery } from "@tanstack/react-query"

export const useGetAllProducts = ()=>{
    return useQuery({
        queryKey: ['get_all_products'],
        queryFn: async()=>{
            const res = await fetch('https://app.beewave.ng/api/products')
            if(!res.ok) return "Error"
            return res.json()
        }
    })
}