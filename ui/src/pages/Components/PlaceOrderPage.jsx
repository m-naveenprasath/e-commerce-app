import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const PlaceOrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/carts/");
      const cart = res.data[0];
      const items = cart?.items || [];

      const productDetails = await Promise.all(
        items.map((item) => api.get(`/products/${item.product}/`))
      );

      const enriched = items.map((item, idx) => ({
        ...item,
        product_details: productDetails[idx].data,
      }));

      setCartItems(enriched);
    } catch (err) {
      alert("❌ Failed to load cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      await api.post("/orders/", {}); // create order from cart
      alert("✅ Order placed successfully!");
      navigate("/"); // go to order history
    } catch (err) {
      alert("❌ Failed to place order");
      console.error(err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product_details.price,
    0
  );

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (cartItems.length === 0)
    return <div className="p-4">🛒 Cart is empty. Nothing to order.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">🧾 Review Your Order</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border rounded-md p-3 bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product_details.image}
                alt={item.product_details.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h4 className="font-medium">{item.product_details.name}</h4>
                <p className="text-gray-500 text-sm">
                  ₹{item.product_details.price} × {item.quantity}
                </p>
              </div>
            </div>
            <div className="font-semibold">
              ₹{item.quantity * item.product_details.price}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-xl font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        🛍️ Confirm & Place Order
      </button>
    </div>
  );
};

export default PlaceOrderPage;
