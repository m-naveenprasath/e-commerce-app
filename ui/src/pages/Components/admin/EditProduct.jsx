import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    api.get(`/products/${id}/`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          category: res.data.category,
        });
        setImagePreview(res.data.image);  // show old image
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        alert("Failed to fetch product.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (imageFile) data.append("image", imageFile);

      await api.patch(`/products/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Product Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded"
          />
        </label>

        <label className="block">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded"
          />
        </label>

        <label className="block">
          Price
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded"
          />
        </label>

        <label className="block">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1 px-4 py-2 border rounded"
          />
        </label>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Preview"
            className="h-32 mt-2 rounded border object-cover"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ✅ Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
