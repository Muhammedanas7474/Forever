import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { CartContext } from "../context/Cartcontext";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import { assets } from "../../public/Images/products/assets";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { createCODOrder, createRazorpayOrder, verifyRazorpayPayment } = useContext(OrderContext);

  // ----------------------------------------------------
  // Validate form
  // ----------------------------------------------------
  const isFormValid = useMemo(() => {
    return (
      form.firstName &&
      form.lastName &&
      form.email &&
      form.street &&
      form.city &&
      form.state &&
      form.pincode &&
      form.country &&
      form.phone &&
      cart.length > 0
    );
  }, [form, cart]);

  // ----------------------------------------------------
  // Input handler
  // ----------------------------------------------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ----------------------------------------------------
  // Razorpay Payment Handler
  // ----------------------------------------------------
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Create Razorpay order
      const razorpayData = await createRazorpayOrder();

      const options = {
        key: razorpayData.key,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: razorpayData.razorpay_order_id,
        handler: async function (response) {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate("/orders");
          } catch (error) {
            console.error("Payment verification failed:", error);
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
    }
  };

  // ----------------------------------------------------
  // Submit Order
  // ----------------------------------------------------
  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      alert("Please fill all fields and make sure cart is not empty.");
      return;
    }

    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (method === "cod") {
        // Handle COD order
        await createCODOrder();
        clearCart();
        navigate("/orders");
      } else if (method === "razorpay" || method === "stripe") {
        // Handle online payment (Razorpay)
        await handleRazorpayPayment();
      }
    } catch (error) {
      console.error("Order error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t p-5">

      {/* LEFT - Delivery Info */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input 
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange} 
            className="border rounded py-1.5 px-3.5 w-full" 
            type="text" 
            placeholder="First Name" 
            required
          />
          <input 
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange} 
            className="border rounded py-1.5 px-3.5 w-full" 
            type="text" 
            placeholder="Last Name" 
            required
          />
        </div>

        <input 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          className="border rounded py-1.5 px-3.5 w-full" 
          type="email" 
          placeholder="Email" 
          required
        />
        <input 
          name="street" 
          value={form.street} 
          onChange={handleChange} 
          className="border rounded py-1.5 px-3.5 w-full" 
          type="text" 
          placeholder="Street" 
          required
        />

        <div className="flex gap-3">
          <input 
            name="city" 
            value={form.city} 
            onChange={handleChange} 
            className="border rounded py-1.5 px-3.5 w-full" 
            type="text" 
            placeholder="City" 
            required
          />
          <input 
            name="state" 
            value={form.state} 
            onChange={handleChange} 
            className="border rounded py-1.5 px-3.5 w-full" 
            type="text" 
            placeholder="State" 
            required
          />
        </div>

        <div className="flex gap-3">
          <input 
            name="pincode" 
            value={form.pincode} 
            onChange={handleChange} 
            className="border rounded py-1.5 px-3.5 w-full" 
            type="number" 
            placeholder="PinCode" 
            required
          />
          <input 
            name="country" 
            value={form.country} 
            onChange={handleChange} 
            className="border rounded py-1.5 px-3.5 w-full" 
            type="text" 
            placeholder="Country" 
            required
          />
        </div>

        <input 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          className="border rounded py-1.5 px-3.5 w-full" 
          type="number" 
          placeholder="Phone" 
          required
        />
      </div>

      {/* RIGHT - Cart + Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div 
              onClick={() => setMethod("cod")} 
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></div>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>

            <div 
              onClick={() => setMethod("razorpay")} 
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <div className={`w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}></div>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="Razorpay" />
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={handlePlaceOrder}
              disabled={!isFormValid || isSubmitting}
              className={`px-16 py-3 text-sm rounded ${
                isFormValid && !isSubmitting 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;