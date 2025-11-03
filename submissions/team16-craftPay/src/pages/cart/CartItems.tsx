import { useState, useEffect } from "react";
import { Skeleton } from "antd"
import { useGetCartItems } from "../../hooks/useGetCartItems"
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeItemFromCartApi } from "../../api/cartPushAPI/removeItemFromCartApi";
import useNotification from "antd/es/notification/useNotification";
import { updateCartQtyApi } from "../../api/cartPushAPI/pushUpdateCartQty";
import ButtonUi from "../../component/ButtonUi";

// simple debounce hook (no external lib needed)
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

const CartItems = () => {
  const { data, isPending, error } = useGetCartItems()
  const [message, contextHolder] = useNotification()

  const { mutateAsync: deleteCartItem, isPending: pendingDeleteItem, error: deleteItemError } = removeItemFromCartApi()
  const { mutateAsync: updateQty, isPending: pendingUpdate, error: updateQtyError } = updateCartQtyApi()

  // store quantities in local state
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  // debounce quantities to avoid spamming requests
  const debouncedQuantities = useDebounce(quantities, 1000)

  !isPending && !error && console.log(data);


  // initialize quantities when data comes in
  useEffect(() => {
    if (data?.cart_items) {
      const initialQuantities: Record<number, number> = {}
      data.cart_items.forEach((item: any) => {
        initialQuantities[item.cart_item_id] = item.quantity
      })
      setQuantities(initialQuantities)
    }
  }, [data])

  // whenever debounced quantities change, call backend update
  useEffect(() => {
    if (!data?.cart_items) return

    data.cart_items.forEach((item: any) => {
      const currentQty = item.quantity
      const newQty = debouncedQuantities[item.cart_item_id]

      // only call if qty actually changed
      if (newQty !== undefined && newQty !== currentQty) {
        updateQty({ id: item.cart_item_id, qty: newQty })
          .then(() => {
            message.success({
              message: `Updated ${item.title} to qty ${newQty}`
            })
          })
          .catch(() => {
            message.error({
              message: `Failed to update ${item.title}`
            })
          })
      }
    })
  }, [debouncedQuantities])

  const handleDeleteItem = async (cartId: number) => {
    try {
      await deleteCartItem(cartId)
      !pendingDeleteItem && !deleteItemError && message.success({
        message: "Item Removed Successfully"
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleIncrease = (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }))
  }

  const handleDecrease = (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1
    }))
  }

  return (
    <main className="lg:mt-24">
      {contextHolder}
      <Skeleton loading={isPending}>
        {!isPending && error && <p className="text-7xl">An error</p>}

        {!isPending && !error && data?.cart_items?.length === 0 && (
          <p className="text">No item</p>
        )}

        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-24">
          {!isPending && !error && data?.cart_items?.length > 0 &&
            data.cart_items.map((item: any) => (
              <div key={item.cart_item_id} className="relative bg-[#FAF2E7] shadow-md rounded-md pb-1 flex flex-row items-center justify-between">
                <img src={item.image} alt={item.title} className="w-[30%] max-h-fit" />

                <div className="w-[70%] p-4 flex-grow">
                  <div className="flex flex-col space-y-1">
                    <aside className="absolute right-3">
                      <RiDeleteBin6Line
                        className={`text-xl cursor-pointer ${pendingDeleteItem
                          ? "text-gray-400 cursor-not-allowed opacity-50"
                          : "text-red-700 hover:opacity-80"
                          }`}
                        onClick={() => {
                          if (!pendingDeleteItem) handleDeleteItem(item.cart_item_id)
                        }}
                      />
                    </aside>

                    <h1 className="text-md font-semibold">{item.title}</h1>
                    <p className="text-sm text-gray-800">PRICE: NGN{item.price}</p>

                    <div className="flex flex-row items-center justify-between">
                      <span className="flex flex-row border w-[70%] px-3 py-1 bg-white rounded-full border-gray-400 shadow-lg items-center mt-8">
                        <p
                          className="cursor-pointer text-xl w-[30%] text-start select-none"
                          onClick={() => handleDecrease(item.cart_item_id)}
                        >
                          &mdash;
                        </p>
                        <h3 className="text-xl w-[40%] text-center select-none">
                          {quantities[item.cart_item_id] ?? item.quantity}
                        </h3>
                        <p
                          className="cursor-pointer text-2xl w-[30%] text-end select-none"
                          onClick={() => handleIncrease(item.cart_item_id)}
                        >
                          +
                        </p>
                      </span>
                    </div>

                    <p className="text-md font-semibold mt-4">
                      SUB-TOTAL: NGN{(quantities[item.cart_item_id] ?? item.quantity) * item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </section>
        <section className="mt-6">
          <div className="bg-white border border-gray-400 p-8 mb-4 rounded-xl text-2xl font-semibold">
            Total: NGN{data.cart_total}
          </div>
          <ButtonUi btnName="Checkout" />
        </section>

      </Skeleton>
    </main>
  )
}

export default CartItems
