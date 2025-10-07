import { useParams } from "react-router"
import { useGetSingleProduct } from "../../hooks/usetGetSingleProduct"
import { Skeleton } from "antd"
import { useState } from "react"
import ButtonUi from "../../component/ButtonUi"
import { FaCarSide } from "react-icons/fa6";
import { RiShoppingBagLine } from "react-icons/ri";
import { pushCartData } from "../../api/cartPushAPI/pushCartData"
import useNotification from "antd/es/notification/useNotification"
import { useGetCartItems } from "../../hooks/useGetCartItems"

export type ItemToCartInfo = {
    product_id: number;
    title: string;
    description: string;
    price: number;
    image_url: string;
    quantity: number;

}

const ItemPreview = () => {
    const param = useParams()
    const [qtyValue, setQtyValue] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAdded, setIsAdded] = useState<boolean>(false)

    const [message, contextHolder] = useNotification()


    const { data, isPending, error } = useGetSingleProduct(Number(param.id))
    const {refetch: refetchCart} = useGetCartItems()

    !isPending && !error && console.log(data.product)



    const handleAddItemToCart = async (data: any) => {
        setIsLoading(true)

        const newItem: ItemToCartInfo = {
            product_id: Number(param.id),
            title: data.title,
            description: data.description,
            price: data.price,
            image_url: data.image_url,
            quantity: qtyValue
        }

        console.log(newItem)
        try {
            const res = await pushCartData(newItem)

            if (res?.success === false) {
                message.error({
                    message: res.msg
                })
            }

            message.success({
                message: res.msg
            })
            setIsAdded(true)
            refetchCart()

        } catch (error) {
            message.error({
                message: "An error Occured!"
            })
        } finally {
            setIsLoading(false)
        }



    }

    return (
        <main className="mt-24">
            {contextHolder}
            <Skeleton loading={isPending}>
                {!isPending && !error && data.product && (
                    <section key={data.product.id} className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-8 w-full">
                        <img src={data.product.image_url} alt={data.product.title} className="lg:w-[50%] lg:h-[80vh]" />

                        <div className="flex flex-col w-full lg:w-[47%]">
                            <div className="flex flex-col">
                                <p className="text-gray-600 font-light mb-5 mt-1">Category: {data.product.category}</p>
                                <h1 className="text-2xl font-semibold">{data.product.title}</h1>
                                <h3 className="text-lg font-light text-gray-600">{data.product.description}</h3>
                            </div>

                            <div className="mt-6 flex justify-between w-full">
                                <div className="w-[60%]">
                                    <h1 className="text-xl mb-3">QTY</h1>
                                    <span className="flex flex-row border w-[70%] px-3 py-2 bg-white rounded-full border-gray-400 shadow-lg items-center">
                                        <p className="cursor-pointer text-xl w-[30%] text-start select-none" onClick={() => qtyValue > 1 && setQtyValue(prev => prev - 1)}>&mdash;</p>
                                        <h3 className="text-xl w-[40%] text-center select-none">{qtyValue}</h3>
                                        <p className="cursor-pointer text-2xl w-[30%] text-end select-none" onClick={() => setQtyValue(prev => prev + 1)}>+</p>
                                    </span>
                                </div>
                                <div className="w-[40%] mb-12">
                                    <h1 className="text-xl mb-5">PRICE TOTAL</h1>
                                    <h1 className="select-none text-xl font-semibold">NGN {(data.product.price * qtyValue).toFixed(2)}</h1>
                                </div>
                            </div>

                            <div className="flex flex-col space-x-4 p-2 border-[0.5px] border-gray-200 bg-white shadow-lg mb-12 rounded-lg md:w-[100%]">
                                <span className="flex space-x-4 border-b-[0.5px] border-gray-200 pb-3">
                                    <FaCarSide className="text-4xl" />
                                    <aside className="flex flex-col space-y-1">
                                        <h1 className="text-xl font-semibold">Free Shipping</h1>
                                        <p className="text-sm text-gray-500">Across lagos and other rural areas e.g Badagry, Ikorodu, Ajegunle</p>
                                    </aside>
                                </span>
                                <span className="flex space-x-4 mt-3 pb-3">
                                    <RiShoppingBagLine className="text-3xl" />
                                    <aside className="flex flex-col space-y-1">
                                        <h1 className="text-xl font-semibold">Return Delivery</h1>
                                        <p className="text-sm text-gray-500">Free 30 days Delivery Return. T&C Apply.</p>
                                    </aside>
                                </span>
                            </div>

                            <div
                                onClick={() => handleAddItemToCart(data.product)}
                            >
                                <ButtonUi btnName={isLoading ? "Adding..." : "Add to Cart"} disabled={isLoading} />
                            </div>
                        </div>
                    </section>
                )}
            </Skeleton>
        </main>
    )
}

export default ItemPreview