import { Route, Routes } from "react-router"
import Navbar from "./component/Navbar"
import routes from "./routes/route"

function App() {

  return (
    <div className="py-5 px-3 bg-gray-50">
      <Navbar />

      <div className="px-6 mt-24 lg:mt-8 min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-5rem)]">
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>

    </div>
  )
}

export default App
