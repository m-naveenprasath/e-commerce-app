import { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post("/categories/", { name });
      navigate("/admin/categories"); // Redirect to category list
    } catch (err) {
      setError("❌ Failed to create category.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          🗂️ Create New Category
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/\b\w/g, (char) => char.toUpperCase()))
              }
              required
              placeholder="E.g. Electronics"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            📝 Create Category
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/admin/categories"
            className="text-blue-500 hover:underline text-sm"
          >
            ← Back to Category List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
