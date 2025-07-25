import { useEffect, useState } from "react";
import api from "../../services/api";
import generatePDF from "../../utils/GeneratePDF";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders/")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleDownload = (order) => {
    generatePDF(order);
  };


  return (
    <div className="p-6 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📦 All Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No orders found.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border shadow-md rounded-2xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-700 font-medium">
                  <span className="font-semibold">Order ID:</span> #{order.id}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>

              <div className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">User:</span>{" "}
                {order.user?.email || "Unknown"}
              </div>

              {/* Product Items */}
              <div className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded object-cover border"
                      />
                      <span className="text-gray-700">{item.product.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-blue-600 font-semibold">
                Status: {order.status}
              </div>

              {/* 📄 Download Receipt Button */}
              <button
                onClick={() => handleDownload(order)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                📄 Download Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
