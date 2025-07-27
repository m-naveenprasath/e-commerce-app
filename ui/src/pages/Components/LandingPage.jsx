import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import ProductDetail from "./ProductDetail";
import CartDrawer from "./CartDrawer";
import OrderList from "./OrderList";
import Navbar from "./NavBar";
import LoginModal from "../LoginModal";
import { useDebounce } from "../../utils/useDebounce";
import { AuthContext } from "../../context/AuthContext";

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartRefreshSignal, setCartRefreshSignal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to admin dashboard if admin user
  useEffect(() => {
    if (user?.is_admin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get("/categories/");
        setCategories(catRes.data);

        const productData = {};
        for (const cat of catRes.data) {
          const prodRes = await api.get(`/products/?category=${cat.id}`);
          productData[cat.name] = prodRes.data;
        }
        setProductsByCategory(productData);
      } catch (err) {
        console.error("Error fetching categories/products:", err);
      }
    };

    fetchData();
    fetchCartCount();
  }, []);

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const res = await api.get("/carts/");
      const cartList = res.data;
      const items = cartList.length > 0 ? cartList[0].items : [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      const errorMessage = err.response?.data?.detail;
      const status = err.response?.status;

      if (
        status === 401 ||
        errorMessage === "Authentication credentials were not provided."
      ) {
        setCartCount(0); // not logged in
      } else {
        console.error("Error fetching cart count:", err);
      }
    }
  };

  // Search logic
  useEffect(() => {
    if (debouncedSearch) {
      const results = Object.values(productsByCategory)
        .flat()
        .filter((product) =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, productsByCategory]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      await api.post("/cart/add/", { product: productId, quantity: 1 });
      fetchCartCount();
      setCartRefreshSignal((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleCategoryClick = (categoryId) => {
    document
      .getElementById(`category-${categoryId}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCartClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowCart(true);
    }
  };

  const handleOrdersClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowOrdersModal(true);
    }
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <Navbar
        categories={categories}
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchResults={searchResults}
        onSelectProduct={setSelectedProduct}
        onCategoryClick={handleCategoryClick}
        onCartClick={handleCartClick}
        onMyOrdersClick={handleOrdersClick}
        onScrollTop={handleScrollToTop}
        setShowLoginModal={setShowLoginModal}
      />

      {/* 🛍️ Product Listings */}
      <div className="p-6 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <section id={`category-${cat.id}`} key={cat.id} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              {cat.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {productsByCategory[cat.name]?.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1"
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
                      className="w-full h-40 object-contain bg-gray-100 rounded"
                    />
                    <h3 className="text-sm font-semibold mt-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 🧾 Product Modal */}
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
            <ProductDetail
              productId={selectedProduct.id}
              inModal={true}
              onCartUpdate={() => {
                fetchCartCount();
                setCartRefreshSignal((prev) => prev + 1);
              }}
            />
          </div>
        </div>
      )}

      {/* 🛒 Cart Drawer */}
      <CartDrawer
        show={showCart}
        onClose={() => setShowCart(false)}
        refreshSignal={cartRefreshSignal}
        setCartCount={setCartCount}
      />

      {/* 🧾 Orders Modal */}
      {showOrdersModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4"
          onClick={() => setShowOrdersModal(false)}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowOrdersModal(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
            >
              &times;
            </button>
            <OrderList />
          </div>
        </div>
      )}

      {/* 🔐 Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default LandingPage;
