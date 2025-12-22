import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage"
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
function App() {
  const {user, checkAuth, checkingAuth} = useUserStore();
  const {getCartItems}=useCartStore()
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  useEffect(()=>{
    if(!user)return
    getCartItems();
  },[getCartItems,user])

  if(checkingAuth) {
    return (
      <LoadingSpinner/>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(16,185,129,0.3) 0%, rgba(10,80,60,0.2) 45%, rgba(0,0,0,0.1) 100%)",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user? <HomePage/>:<LoginPage />} />
          <Route path="/signup" element={user? <HomePage/>:<SignUpPage />} />
          <Route path="/secret-dashboard" element={user?.role==="admin"? <AdminPage/>:<LoginPage />} />
          <Route path="/category/:category" element={<CategoryPage/>} />
          <Route path='/cart' element={user? <CartPage/> : <LoginPage />} ></Route>
          <Route path='/purchase-success' element={user? <PurchaseSuccessPage/> : <LoginPage />} ></Route>
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}

export default App;