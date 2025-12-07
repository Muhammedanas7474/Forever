import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import { CartProvider } from "./context/Cartcontext.jsx";
import { WishlistProvider } from "./context/Wishlistcontext.jsx";
import { ProductProvider } from "./context/Productcontext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";



createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <AdminProvider>
                <App />  
              </AdminProvider>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </BrowserRouter>
);

