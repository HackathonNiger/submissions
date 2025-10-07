import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router";
import { FaCartArrowDown } from "react-icons/fa";
import { useGetCartItems } from "../hooks/useGetCartItems";
import useNotification from "antd/es/notification/useNotification";
import { useAuth } from "../context/AuthContext";



const Navbar = () => {
    const [toggleNav, setToggleNav] = useState<boolean>(false)
    const [message, contextHolder] = useNotification()


    const {cartLength} = useGetCartItems()

    const {token, logout} = useAuth()

    const handleLogout = ()=>{
        
        logout()
        message.success({
            message: "Logged Out Successfully"
        })

    }

    return (
        <nav className={`fixed w-[calc(100%-1.5rem)] flex flex-col mt-1 bg-[#923B10] text-white ${toggleNav ? "rounded-2xl" : "rounded-full"} py-2 px-6 shadow-lg z-50 lg:max-w-[50%] lg:mx-auto left-1/2 -translate-x-1/2 font-sans`}>
            {contextHolder}
            <div className="flex flex-row items-center justify-between ">
                <section className="lg:hidden cursor-pointer hover:opacity-80" onClick={() => setToggleNav(prev => !prev)}>
                    <FaBars />
                </section>
                {/* Nav for lg screen */}
                <section className={`hidden lg:flex`}>
                    <ul className="flex flex-row space-x-16">
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/shop"><li>Shop</li></Link>
                        <li>Artisans</li>
                        <li>Meet the team</li>
                    </ul>
                </section>

                <section className="cursor-pointer rounded-full px-4 hover:opacity-70 hover:duration-200 hover:transition-all flex items-center space-x-1">
                    <span className="absolute -top-[.05rem] bg-red-600 w-5 text-sm font-extrabold right-29 h-5 text-center rounded-full z-10">{cartLength}</span>
                    <Link to="/cart"><FaCartArrowDown className="relative text-2xl mr-6"/></Link>
                    <IoPersonOutline />
                    {!token && <Link to="/login" onClick={()=> setToggleNav(false)}>Login</Link>}

                    <span className={`${token ? "flex" : "hidden"}`} onClick={handleLogout}>Logout</span>
                </section>
            </div>

            {/* Nav for sm screen */}
            <section className={`${toggleNav ? 'flex' : 'hidden'} lg:hidden pt-4`} >
                <ul className="flex flex-col space-y-2 mx-auto text-center">
                    <Link to="/" onClick={()=> setToggleNav(false)}><li>Home</li></Link>
                    <Link to="/shop"><li onClick={()=> setToggleNav(false)}>Shop</li></Link>
                    <li onClick={()=> setToggleNav(false)}>Artisans</li>
                    <li onClick={()=> setToggleNav(false)}>Meet the team</li>
                </ul>
            </section>
        </nav>

    )
}

export default Navbar