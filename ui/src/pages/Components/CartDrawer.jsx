import CartPage from "./CartPage";

const CartDrawer = ({ show, onClose, refreshSignal, setCartCount  }) => {
  return (
    <>
      {/* Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full overflow-y-auto p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-red-600"
          >
            &times;
          </button>

          <CartPage refreshSignal={refreshSignal} setCartCount={setCartCount} />
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
