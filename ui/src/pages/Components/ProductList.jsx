import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Trash2, Pencil } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    api.get("/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}/`);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="p-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">🛍️ All Products</h2>
        <Link
          to="/admin/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🛒 Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative overflow-hidden group">
                <img
                  src={product.image?.includes("http") ? product.image : "/no-image.png"}
                  alt={product.name}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setModalImage(product.image)}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1 mb-2">
                  {product.description.length > 80
                    ? product.description.slice(0, 80) + "..."
                    : product.description}
                </p>
                <p className="text-lg font-bold text-green-600">₹{product.price}</p>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
