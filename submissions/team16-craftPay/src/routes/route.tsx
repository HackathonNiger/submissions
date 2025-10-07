import type { RouteObject } from "react-router";
import LandingPg from "../pages/landingPg/LandingPg";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import RegisterTypeForm from "../pages/auth/register/RegisterTypeForm";
import AllItems from "../pages/Items/AllItems";
import ItemPreview from "../pages/Items/ItemPreview";
import CartItems from "../pages/cart/CartItems";
import CreateProduct from "../pages/createProduct/CreateProduct";


const routes: RouteObject[] = [
    {
        path:'/',
        element: <LandingPg/>
    },
    {
        path:'/login',
        element: <Login/>
    },
    {
        path:'/register',
        element: <Register/>,
    },
    {
        path: '/register/:type',
        element: <RegisterTypeForm/>
    },
    {
        path: '/shop',
        element: <AllItems/>
    },
    {
        path: '/shop/:id',
        element: <ItemPreview/>
    },
    {
        path: '/cart',
        element: <CartItems/>
    },
    {
        path: '/create-product',
        element: <CreateProduct/>
    },
]

export default routes