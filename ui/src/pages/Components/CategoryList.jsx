import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    api.get("/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}/`);
      setRefresh(!refresh);
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  return (

    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-right mb-4">
        <Link
          to="create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          📂 Add New Category
        </Link>
      </div>
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">📂 Categories</h2>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500">No categories found.</div>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border hover:shadow-md transition"
            >
              <span className="text-lg font-medium text-gray-700">{category.name}</span>
              <div className="flex gap-4">
                <Link
                  to={`/categories/${category.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800 flex items-center text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
