import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/UserAuthContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    total,
    clearCart,
    loadingCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  /* =========================
     HANDLERS
  ========================= */
  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loadingCart) {
    return (
      <div className="bg-amber-50 min-h-screen flex items-center justify-center">
        <p className="text-amber-700 font-medium">Loading cart...</p>
      </div>
    );
  }

  /* =========================
     EMPTY CART
  ========================= */
  if (cartItems.length === 0) {
    return (
      <div className="bg-amber-50 text-gray-800 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-amber-700 mb-4">
          Your Cart is Empty
        </h1>
        <Link
          to="/shop"
          className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  /* =========================
     CART UI
  ========================= */
  return (
    <div className="bg-amber-50 text-gray-800 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-700 mb-8">
          Your Shopping Cart
        </h1>

        <div className="space-y-6">
          {cartItems.map((item) => {
            const price = item.price || 0;
            const qty = item.qty || 1;
            const itemTotal = price * qty;

            return (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center justify-between bg-white p-5 rounded-xl border border-amber-200 shadow-sm"
              >
                {/* IMAGE + INFO */}
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/100?text=No+Image"
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100?text=No+Image";
                    }}
                  />

                  <div>
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-gray-600">
                      Ksh {price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* QUANTITY */}
                <div className="flex items-center mt-3 md:mt-0">
                  <button
                    onClick={() => updateQty(item._id, qty - 1)}
                    disabled={qty <= 1}
                    className={`px-3 py-1 rounded-l-lg text-lg ${
                      qty <= 1
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-amber-100 hover:bg-amber-200"
                    }`}
                  >
                    −
                  </button>

                  <span className="px-4 py-1 bg-white border-t border-b border-amber-300">
                    {qty}
                  </span>

                  <button
                    onClick={() => updateQty(item._id, qty + 1)}
                    className="bg-amber-100 px-3 py-1 rounded-r-lg text-lg hover:bg-amber-200"
                  >
                    +
                  </button>
                </div>

                {/* TOTAL + REMOVE */}
                <div className="text-right mt-3 md:mt-0">
                  <p className="text-amber-700 font-semibold">
                    Ksh {itemTotal.toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 text-sm hover:text-red-600 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-md mt-10">
          <div className="flex justify-between text-lg">
            <span className="font-medium text-gray-700">Subtotal:</span>
            <span className="text-amber-700 font-semibold">
              Ksh {total.toLocaleString()}
            </span>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Clear Cart
            </button>

            <button
              onClick={handleCheckout}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
