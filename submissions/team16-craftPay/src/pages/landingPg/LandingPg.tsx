import heroImg from "../../assets/heroImg.png"
import heroImg2 from "../../assets/heroImg2.png"
import heroImg3 from "../../assets/heroImg3.png"
import heroImg4 from "../../assets/heroImg4.png"
import heroImg5 from "../../assets/heroImg5.png"
import heroImg6 from "../../assets/heroImg6.png"
import ButtonUi from '../../component/ButtonUi'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router"
import { useAuth } from "../../context/AuthContext"

const LandingPg = () => {
    const heroImgs = [heroImg, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6]
    
    const { role } = useAuth()

    // carousel library settings
    const settings = {
        className: "center",
        centerMode: false,
        infinite: true,
        centerPadding: "40px",
        slidesToShow: 1,
        speed: 300,
        autoplay: true,
        pauseOnHover: false,
    };

    return (
        <main>
            <header className='flex flex-col items-center space-y-6 lg:flex-row-reverse lg:h-screen lg:justify-between'>
                <section className="lg:w-[45%] ">
                    <h1 className='text-2xl text-center lg:text-start lg:text-3xl'>CraftPay - Local Artisans Marketplace</h1>
                    <p className='text-lg mt-4 mb-6 lg:text-xl'>Dive into the world of artisans, where each creation is a testament to passion, skill, and the love for the craft. From intricately designed textiles to hand-sculpted pottery, every piece reflects the individuality and artistry of the creators who call our community home.
                    </p>
                    <Link to="/shop"><ButtonUi btnName="Shop now" /></Link>

                    <div className={`${role === "artisan" ? "block" : "hidden"} mt-4`}><Link to="/create-product"><ButtonUi btnName="Add a Product" /></Link></div>
                </section>

                <section className="w-full lg:w-[50%]">
                    <Slider {...settings}>
                        {heroImgs.map((eachImg, index) => (
                            <div key={index} className="rounded-xl shadow-2xl h-80 lg:h-[70vh]">
                                <img
                                    src={eachImg}
                                    alt="Local artisan marketplace"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        ))}
                    </Slider>

                </section>  
            </header>
        </main>
    )
}

export default LandingPg