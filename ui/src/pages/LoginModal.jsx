import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose }) => {
  const { login, register, user } = useContext(AuthContext); // Add `register` method in AuthContext
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid credentials");
      }
    } else {
      // Registration mode
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const result = await register(email, password);
      if (!result.success) {
        setError(result.message || "Registration failed");
        return;
      }

      // Auto login after successful registration
      const loginSuccess = await login(email, password);
      if (!loginSuccess) {
        setError("Login failed after registration");
      }
    }
  };

  useEffect(() => {
    if (user) {
      if (user.is_admin) {
        navigate("/admin");
      } else {
        onClose();
        window.location.reload();
      }
    }
  }, [user, navigate, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg flex w-full max-w-4xl overflow-hidden relative">
        {/* Left Image / Promo */}
        <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('https://cdn-felem.nitrocdn.com/mCFFtBbbIOwHIDBOyBVuDXJuWiymyPku/assets/images/optimized/rev-a389fd0/www.adfactory.mx/wp-content/uploads/ecom.png')` }}></div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-500"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold text-center mb-4">
            {isLogin ? "Login to ShopNow.com" : "Create Your Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {!isLogin && (
              <input
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
