import { useQuery } from "@tanstack/react-query"

export const useGetSingleProduct = (id:number) =>{
    const {data, isPending, error} = useQuery({
        queryKey: [`get_product_id_${id}`],
        queryFn: async()=>{
            const res = await fetch(`https://app.beewave.ng/api/products?id=${id}`)
            if(!res.ok) return "Error"
            return res.json()

        }
    })

    return {data, isPending, error}
}