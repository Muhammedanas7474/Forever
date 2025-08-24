import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext"; 
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const { user } = useContext(AuthContext); // logged-in user
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:3000/users/${user.id}`)
        .then(res => {
          setOrders(res.data.orders || []);
        })
        .catch(err => console.error("Error fetching orders:", err));
    }
  }, [user]);

  return (
    <div className="border-t pt-16 p-3">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orders.length === 0 ? (
          <p className="text-gray-500 mt-4">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="py-4 border-t border-b text-gray-700">
              <p className="mb-2 text-sm text-gray-500">
                Order ID: <span className="font-medium">{order.id}</span>
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Date: <span className="text-gray-400">{new Date(order.orderDate).toDateString()}</span>
              </p>

              {order.cart.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3 border-t"
                >
                  <div className="flex items-start gap-6 text-sm">
                    {/* 👇 Only works if you store image in db, otherwise use placeholder */}
                    <img className="w-16 sm:w-20" src={item.image || "/placeholder.png"} alt={item.name} />
                    <div>
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}{item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <p className={`min-w-2 h-2 rounded-full ${order.status === "pending" ? "bg-yellow-500" : "bg-green-500"}`}></p>
                      <p className="text-sm md:text-base">{order.status}</p>
                    </div>
                    <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                      Track order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
