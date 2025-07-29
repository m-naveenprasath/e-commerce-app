import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProductDetail = ({ productId: propProductId, inModal = false, onCartUpdate = () => { } }) => {
  const { id: routeId } = useParams(); // for route usage
  const id = propProductId || routeId;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      await api.post("cart/add/", {
        product: product.id,
        quantity,
      });

      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full bg-indigo-600 text-white shadow-lg rounded-lg pointer-events-auto flex items-center px-4 py-3`}
        >
          <div className="text-2xl animate-bounce mr-3">🛒</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Added to Cart</p>
            <p className="text-xs opacity-90">Your item has been added!</p>
          </div>
        </div>
      ));

      onCartUpdate(); // Trigger refresh
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("❌ Something went wrong!");
    }
  };


  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found.</div>;

  return (
    <div className={`${inModal ? '' : 'max-w-5xl mx-auto'} p-6`}>
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={
            product.image?.includes("http")
              ? product.image
              : "/no-image.png"
          }
          alt={product.name}
          className="w-full h-[400px] object-contain bg-white rounded-xl shadow"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-indigo-600 mb-4">
            ₹{product.price}
          </p>

          <div className="mb-6">
  <label className="block mb-2 font-medium">Quantity</label>
  <input
    type="number"
    value={quantity}
    min="1"
    onChange={(e) => setQuantity(Number(e.target.value))}
    className="w-24 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

<button
  onClick={handleAddToCart}
  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
>
  Add to Cart 🛒
</button>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
