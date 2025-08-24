import React, { useContext, useMemo, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../../public/Images/products/assets";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
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

  const { cartItems, products, navigate, clearCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const userId = user?.id || null; // note: it's `id`, not `_id`

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Build cart data
  const cartData = useMemo(() => {
    const list = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        if (qty > 0) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            list.push({
              _id: itemId,
              name: product.name,
              size,
              price: product.price,
              quantity: qty,
              image: product.image, // <-- FIX: save full array
            });
          }
        }
      }
    }
    return list;
  }, [cartItems, products]);

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
      cartData.length > 0
    );
  }, [form, cartData]);

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      alert("⚠️ Please fill all fields and make sure your cart is not empty.");
      return;
    }

    if (!userId) {
      alert("⚠️ You must be logged in to place an order.");
      return;
    }

    const newOrder = {
      id: Date.now().toString(), // order id
      address: { ...form },
      cart: cartData,
      paymentMethod: method,
      totalAmount: cartData.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    try {
      // get fresh user from db.json
      const { data: freshUser } = await axios.get(
        `http://localhost:3000/users/${encodeURIComponent(userId)}`
      );

      const updatedUser = {
        ...freshUser,
        orders: [...(freshUser.orders || []), newOrder],
      };

      // save back to db.json
      await axios.put(
        `http://localhost:3000/users/${encodeURIComponent(userId)}`,
        updatedUser
      );

      // sync local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("✅ Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order Error:", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t p-5">
      {/* Left side - delivery info */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input name="firstName" onChange={handleChange} value={form.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" />
          <input name="lastName" onChange={handleChange} value={form.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" />
        </div>
        <input name="email" onChange={handleChange} value={form.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Enter Your email" />
        <input name="street" onChange={handleChange} value={form.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
        <div className="flex gap-3">
          <input name="city" onChange={handleChange} value={form.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
          <input name="state" onChange={handleChange} value={form.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input name="pincode" onChange={handleChange} value={form.pincode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="PinCode" />
          <input name="country" onChange={handleChange} value={form.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
        </div>
        <input name="phone" onChange={handleChange} value={form.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod("stripe")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod("razorpay")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod("cod")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>

          <div className="w-full text-end mt-8 ">
            <button onClick={handlePlaceOrder} disabled={!isFormValid || !userId} className={`px-16 py-3 text-sm rounded ${isFormValid && userId ? "bg-black text-white hover:bg-gray-800" : "bg-gray-400 text-white cursor-not-allowed"}`}>
              PLACE ORDER
            </button>
            {!userId && <p className="mt-2 text-sm text-red-500">Please log in to place an order.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
