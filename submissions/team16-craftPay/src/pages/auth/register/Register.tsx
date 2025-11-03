import { useNavigate } from "react-router"
import buyerIllustration from "../../../assets/buyerIllustration.jpg"
import sellerillustration from "../../../assets/sellerIllustration.jpg"

const Register = () => {
  const navigate = useNavigate()
  return (
    <main className="lg:mt-32 lg:max-w-[50%] lg:mx-auto">
      <h1 className='text-3xl font-semibold'>Create an account as:</h1>

      <section className='mt-12 flex space-x-8 items-center justify-center'>

        <div className='flex flex-col items-center justify-center space-y-1 bg-gray-100 min-w-36 min-h-36 rounded-full hover:bg-gray-200 hover:transition-all hover:duration-200 cursor-pointer' onClick={()=>navigate('artisan')}>
          <img src={buyerIllustration} alt="buyerIllustration" className='max-w-24'/>
          <h1 className='text-2xl font-light mb-2'> Artisan</h1>
        </div>

        <div className='flex flex-col items-center justify-center space-y-1 bg-gray-100 min-w-36 min-h-36 rounded-full hover:bg-gray-200 hover:transition-all hover:duration-200 cursor-pointer' onClick={()=>navigate('buyer')} >
          <img src={sellerillustration} alt="buyerIllustration" className='max-w-24'/>
          <h1 className='text-2xl font-light mb-2'> Buyer</h1>
        </div>

        {/* <div>Seller</div> */}
      </section>
    </main>
  )
}

export default Register