import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext"; // Import OrderContext
import Title from "../components/Title";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const { 
    orders, 
    loading, 
    cancelOrder, 
    getStatusDisplay 
  } = useContext(OrderContext); // Remove loadOrders

  const [cancellingId, setCancellingId] = React.useState(null);

  // NO NEED FOR useEffect - OrderContext already handles this!
  // The context automatically loads orders when user changes

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancellingId(null);
    }
  };

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  if (loading) {
    return (
      <div className="border-t pt-16 text-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 p-3">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {!user ? (
        <p className="text-gray-500 mt-4">Please login to view your orders</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 mt-4">No orders found</p>
      ) : (
        orders.map((order) => {
          const statusDisplay = getStatusDisplay(order.status);
          
          return (
            <div key={order.id} className="py-6 border-t border-b text-gray-700">
              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-500">
                  Order ID: <span className="font-medium">{order.id}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(order.created_at).toDateString()}
                  </span>
                </p>
              </div>

              {/* Order Items */}
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3 border-t"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img
                      className="w-16 sm:w-20"
                      src={item.product.images?.[0]?.url || "/Images/no-image.png"}
                      alt={item.product.name}
                    />
                    <div>
                      <p className="sm:text-base font-medium">
                        {item.product.name}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          ${item.price}
                        </p>
                        <p>Qty: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Area: Status + Actions */}
                  <div className="md:w-1/2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <p className={`min-w-2 h-2 rounded-full ${statusDisplay.color}`}></p>
                      <p className="text-sm md:text-base">
                        {statusDisplay.text}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100">
                        Track order
                      </button>

                      {(order.status === "pending" ||
                        order.status === "processing") && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="border border-red-500 text-red-500 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === order.id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}

                      {order.status === "cancelled" && (
                        <span className="text-red-500 text-sm px-4 py-2">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;