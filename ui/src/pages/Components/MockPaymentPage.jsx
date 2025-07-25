import { useState, useMemo } from "react";
import Lottie from "lottie-react";
import successAnimation from "./success.json"; // or use a remote URL
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const upiApps = [
  { name: "Upi Apps", logo: "https://st1.techlusive.in/wp-content/uploads/2023/03/UPI-apps.jpg" },
];

const MockPaymentPage = ({ selectedAddressId, total, onSuccess }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedApp = useMemo(() => {
    return upiApps[Math.floor(Math.random() * upiApps.length)];
  }, []);

  const handlePayNow = async () => {
    setProcessing(true);

    try {
      const res = await api.post("/orders/", {
        shipping_address_id: selectedAddressId,
        status:"Completed",
      });

      await new Promise((r) => setTimeout(r, 2500)); // ⏳ simulate delay

      setSuccess(true);

      setTimeout(() => {
        // 🎉 Navigate to receipt page
        navigate("/orders");
        onSuccess?.();
      }, 4500);
    } catch (err) {
      alert("❌ Payment failed");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };


  return (
    <div className="p-6 bg-white rounded shadow max-w-sm w-full text-center">
      {success ? (
        <div>
          <Lottie
            animationData={successAnimation}
            loop={false}
            style={{ height: 150 }}
          />
          <p className="text-green-600 font-semibold mt-4">Payment Successful!</p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4">🧾 Confirm UPI Payment</h3>
          <div className="flex flex-col items-center space-y-3">
            <img
              src={selectedApp.logo}
              alt={selectedApp.name}
              className="h-12 object-contain"
            />
            <p className="text-gray-700 text-sm">
              UPI ID for payment: <strong>8667429456@upi</strong>
            </p>
            <p className="text-lg font-bold">Amount: ₹{total}</p>

            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {processing ? "Processing..." : "✅ Confirm & Pay"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MockPaymentPage;
