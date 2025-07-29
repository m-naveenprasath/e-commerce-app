// ShippingAddressForm.jsx
import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const ShippingAddressForm = ({ onSuccess, onClose,  initialData = null }) => {
const [form, setForm] = useState(
  initialData || {
    full_name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  }
);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = initialData
      ? await api.patch(`/addresses/${initialData.id}/`, form)
      : await api.post("/addresses/", form);
    toast.success("Address saved successfully!");
    onSuccess?.(res.data);
    onClose?.();
        // ✅ Reload page only on PATCH
    if (initialData) {
      setTimeout(() => {
        window.location.reload();
      }, 500); // Delay to let toast show
    }
  } catch (err) {
    console.error("❌ Failed to save address", err);
    alert("❌ Error saving address");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">📬 Add New Address</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            "full_name",
            "phone_number",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
          ].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              required={field !== "address_line2"}
              className="w-full p-2 border rounded"
            />
          ))}

          {/* ✅ is_default checkbox */}
          {/* <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm">Set as default address</span>
          </label> */}

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
