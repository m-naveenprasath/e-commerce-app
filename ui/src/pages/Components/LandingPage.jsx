import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductDetail from "./ProductDetail";
import CartDrawer from "./CartDrawer"; // ✅ Adjust path as needed

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartRefreshSignal, setCartRefreshSignal] = useState(0);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const catRes = await api.get("/categories/");
        setCategories(catRes.data);

        const productData = {};
        for (const cat of catRes.data) {
          const prodRes = await api.get(`/products/?category=${cat.id}`);
          console.log(prodRes.data,'nn');
          productData[cat.name] = prodRes.data;
        }
        setProductsByCategory(productData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCategoriesAndProducts();
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/carts/");
      const cartList = res.data;

      const items = cartList.length > 0 ? cartList[0].items : [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart/add/", {
        product: productId,
        quantity: 1,
      });
      alert("✅ Product added to cart!");
      fetchCartCount();
      setCartRefreshSignal((prev) => prev + 1); // 👈 Trigger refresh
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add to cart.");
    }
  };  

  

  return (
    <div className="p-4 relative">
      {/* Cart Button with Count */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative inline-flex items-center">
          <button
            onClick={() => setShowCart(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow"
          >
            🛒 Cart
          </button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">{cat.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {productsByCategory[cat.name]?.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                <div
                  className="cursor-pointer p-4"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={
                      product.image?.includes("http")
                        ? product.image
                        : "/no-image.png"
                    }
                    alt={product.name}
                    className="w-full h-40 object-contain rounded-md mb-3 bg-gray-50"
                  />
                  <h3 className="text-md font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ₹{product.price}
                  </p>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition"
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
            >
              &times;
            </button>
            <ProductDetail productId={selectedProduct.id} inModal={true}
              onCartUpdate={() => {
                fetchCartCount();               // update badge
                setCartRefreshSignal((prev) => prev + 1); // update cart drawer
              }}
            />
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        show={showCart}
        onClose={() => setShowCart(false)}
        refreshSignal={cartRefreshSignal}
        setCartCount={setCartCount} // ✅ Pass down setCartCount
      />
    </div>
  );
};

export default LandingPage;



