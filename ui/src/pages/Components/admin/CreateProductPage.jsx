import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  const capitalize = (value) => {
    return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleChange = (field, value) => {
    const capitalizedValue = ["description"].includes(field)
      ? capitalize(value)
      : value;

    setForm((prev) => ({ ...prev, [field]: capitalizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    try {
      await api.post("/products/", formData);
      alert("✅ Product created!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🛒 Create New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Product Name
            </label>
            <input
              type="text"
              placeholder="E.g. Apple iPhone"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Description
            </label>
            <textarea
              placeholder="Enter product description..."
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Price (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Eg: 999.99"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("image", e.target.files[0])}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-white file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              🚀 Launch Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
