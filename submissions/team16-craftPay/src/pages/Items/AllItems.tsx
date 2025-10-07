import { Link } from "react-router"
import ButtonUi from "../../component/ButtonUi"
import { useGetAllProducts } from "../../hooks/useGetAllProducts"
import { Skeleton } from "antd"
import useNotification from "antd/es/notification/useNotification"

const AllItems = () => {
  const { isPending, error, data } = useGetAllProducts()

  !isPending && !error && console.log(data)

  const [message, contextHolder] = useNotification()

  if (!isPending && error) {
    message.error({ 
      message: "An error occured. Please check your internet connection or try again." 
    })
  }

  return (
    <main className="lg:mt-24">
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-4">All Available Products</h1>
      <p className="text-sm text-[#923B10] underline mb-16">{(!isPending && !error && data && data.products.length) || 0} items found</p>

      <Skeleton loading={isPending} >
        {!isPending && error && <p>An error</p>}
        <section className="mt-4 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-24">
          {!isPending && !error && data?.products.length > 0 && data.products.map((item: any) => (
            <div key={item.id} className="bg-[#FAF2E7] shadow-md rounded-md pb-3 flex flex-col">
              <img src={item.image_url} alt={item.title} className="h-56 object-cover w-full" />

              <div className="mt-6 mb-8 w-full p-4 flex-grow">
                <div className="w-[40%] h-[1px] bg-[#D5B39D] rounded-full mb-3"></div>

                <div className="flex flex-col space-y-4">
                  <p className="text-gray-600 font-light">Category: {item.category.toUpperCase()}</p>
                  <span>
                    <h1 className="text-2xl font-semibold mb-2">{item.title}</h1>
                    <h3 className="text-sm font-light text-gray-600">{item.description}</h3>
                  </span>
                  <p className="text-2xl font-semibold">NGN{item.price}</p>
                </div>
              </div>

              <Link to={`${item.id}`} className="mt-auto">
                <ButtonUi btnName="Full Preview" />
              </Link>
            </div>
          ))}
        </section>
      </Skeleton>

    </main >
  )
}

export default AllItems