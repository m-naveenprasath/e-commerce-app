import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CartPage = ({ refreshSignal, setCartCount }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartWithDetails = async () => {
    try {
      const res = await api.get("/carts/");
      const cartList = res.data;

      const items = cartList.length > 0 ? cartList[0].items : [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);

      if (cartList.length > 0) {
        const items = cartList[0].items;

        const productDetailsList = await Promise.all(
          items.map((item) => api.get(`/products/${item.product}/`))
        );

        const enrichedItems = items.map((item, index) => ({
          ...item,
          product_details: productDetailsList[index].data,
        }));

        setCartItems(enrichedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      alert("❌ Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartWithDetails();
  }, [refreshSignal]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.patch(`/cart-items/${itemId}/`, { quantity: newQuantity });
      fetchCartWithDetails(); // Refresh cart
    } catch (err) {
      alert("❌ Failed to update quantity.");
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart-items/${itemId}/`);
      fetchCartWithDetails(); // Refresh cart
    } catch (err) {
      alert("❌ Failed to remove item.");
      console.error(err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * item.product_details.price,
      0
    );
  };

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (cartItems.length === 0)
    return <div className="p-4">🛒 Your cart is empty.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🛍️ Your Cart</h2>

      <div className="space-y-6">
        {cartItems.map((item) => {
          const product = item.product_details;
          const itemTotal = item.quantity * product.price;

          return (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-6 border rounded-xl shadow-md p-4 bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.description}</p>
                <p className="mt-1 text-indigo-600 font-medium">
                  ₹{product.price}
                </p>

                <div className="flex items-center mt-2 gap-2">
                  <button
                    className="bg-gray-200 px-2 rounded"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="bg-gray-200 px-2 rounded"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 font-medium">Subtotal: ₹{itemTotal}</p>
              </div>

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:underline text-sm"
              >
                🗑️ Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-right space-y-4">
        <h3 className="text-2xl font-bold">🧾 Total: ₹{calculateTotal()}</h3>

        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          onClick={() => navigate("/checkout")
          }
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
