import { useEffect, useState } from "react";
import api from "../../services/api"; // Your Axios instance
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
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
        console.error(err);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  return (
    <div className="p-4 space-y-10">
      {categories.map((cat) => (
        <div key={cat.id}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{cat.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {productsByCategory[cat.name]?.map((product) => (
              <div
                key={product.id}
                className="border rounded-2xl p-4 shadow hover:shadow-xl transition duration-300"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-500 mb-2">₹{product.price}</p>
                <Link
                  to={`/products/${product.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
