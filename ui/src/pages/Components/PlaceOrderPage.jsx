import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import ShippingAddressForm from "./ShippingAddressForm"; // make sure path is correct
import MockPaymentPage from "./MockPaymentPage"; // Adjust path if needed


const PlaceOrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null); // for editing
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  // Fetch cart
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

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses/");
      setAddresses(res.data);
      if (res.data.length > 0) {
        setSelectedAddressId(res.data[0].id); // default select first address
      }
    } catch (err) {
      console.error("❌ Failed to load addresses", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);


  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product_details.price,
    0
  );

  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleNewAddress = (newAddress) => {
    setAddresses((prev) => [newAddress, ...prev]);
    setSelectedAddressId(newAddress.id);
  };

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (cartItems.length === 0)
    return <div className="p-4">🛒 Cart is empty. Nothing to order.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">🧾 Review Your Order</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold mb-2">📦 Shipping Address</h3>
          <button
            onClick={() => {
              setShowAddressModal(true);
              setEditingAddress(null); // New address mode
            }}
            className="text-sm text-indigo-600 underline"
          >
            ➕ Add New
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-gray-500">No saved addresses found.</div>
        ) : (
          <div className="space-y-2">
            {addresses.map((address) => (
              <label
                key={address.id}
                className="flex items-start space-x-3 border p-3 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{address.full_name}</p>
                  <p className="text-sm text-gray-600">
                    {address.address_line1}, {address.city}, {address.state},{" "}
                    {address.postal_code}
                  </p>
                  <div className="text-sm mt-1 flex gap-2">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingAddress(address);
                        setShowAddressModal(true);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm("Are you sure you want to delete this address?")) {
                          await api.delete(`/addresses/${address.id}/`);
                          setAddresses((prev) => prev.filter((a) => a.id !== address.id));
                          if (selectedAddressId === address.id) setSelectedAddressId(null);
                        }
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </label>
            ))}

          </div>
        )}
      </div>

      {showAddressModal && (
        <ShippingAddressForm
          initialData={editingAddress}
          onSuccess={(updatedAddress) => {
            if (editingAddress) {
              setAddresses((prev) =>
                prev.map((addr) =>
                  addr.id === updatedAddress.id ? updatedAddress : addr
                )
              );
            } else {
              setAddresses((prev) => [updatedAddress, ...prev]);
              setSelectedAddressId(updatedAddress.id);
            }
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
        />
      )}


      {/* Cart Items */}
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

      {/* Total */}
      <div className="mt-6 flex justify-between items-center text-xl font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      {/* Place Order */}
      <button
        onClick={() => setShowPayment(true)} // 👈 just open payment form
        disabled={!selectedAddressId}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        Procced to Buy
      </button>


      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <MockPaymentPage
              selectedAddressId={selectedAddressId}
              total={total}
              onSuccess={() => {
                setShowPayment(false);
                // navigate("/orders"); // Redirect to orders page
              }}
            />
          </div>
        </div>
      )}


    </div>
  );
};

export default PlaceOrderPage;
