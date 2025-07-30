import { useContext, useState } from "react";
import {
  Search,
  ShoppingCart,
  ListFilter,
  Home,
  PackageSearch,
  Package,
  Menu,
  X,
  LogOut,
  LogIn,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  categories,
  cartCount,
  searchTerm,
  onSearchChange,
  searchResults,
  onSelectProduct,
  onCategoryClick,
  onCartClick,
  onMyOrdersClick,
  onScrollTop,
  setShowLoginModal,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
          <Package className="w-6 h-6" />
          <span className="hidden sm:inline">ShopNow.com</span>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Center: Navigation */}
        <nav
          className={`${menuOpen ? "block" : "hidden"
            } md:flex items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-6 absolute md:static bg-white top-full left-0 w-full md:w-auto border-t md:border-none px-4 py-4 md:p-0 z-40`}
        >
          <button
            onClick={() => {
              onScrollTop();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          {/* Categories */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium"
            >
              <ListFilter className="w-5 h-5" />
              <span>Categories</span>
            </button>
            {showCategoryDropdown && (
              <div
                onMouseLeave={() => setShowCategoryDropdown(false)}
                className="absolute left-0 mt-2 w-48 bg-white border rounded shadow z-50"
              >
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setShowCategoryDropdown(false);
                      setMenuOpen(false);
                      onCategoryClick(cat.id);
                    }}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onMyOrdersClick();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium"
          >
            <PackageSearch className="w-5 h-5" />
            <span>My Orders</span>
          </button>

          {/* Mobile View: Cart & Login/Logout */}
          <div className="md:hidden mt-4 flex flex-col space-y-3">
            <button onClick={onCartClick} className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium">
              <ShoppingCart className="w-5 h-5" />
              <span>
                Cart{" "}
                {cartCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </nav>

        {/* Right: Search, Cart, Login/Logout (Desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Box */}
          <div className="relative w-64">
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            {searchResults.length > 0 && (
              <div className="absolute z-10 top-11 left-0 w-full bg-white border rounded shadow">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button onClick={onCartClick} className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-800 hover:text-indigo-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Logout or Login */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition-colors duration-200 shadow-sm"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200 shadow-md"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
