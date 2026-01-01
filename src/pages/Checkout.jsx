import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/UserAuthContext";
import api from "../utils/axiosInstance";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // UI-only selector
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [county, setCounty] = useState("");
  const [town, setTown] = useState("");

  const counties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos",
    "Uasin Gishu", "Nyeri", "Kakamega", "Kisii", "Laikipia", "Embu",
    "Kericho", "Meru", "Bungoma", "Kilifi", "Nandi", "Busia",
    "Trans Nzoia", "Migori", "Siaya", "Garissa", "Narok",
  ];

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      ),
    [cartItems]
  );

  const deliveryFee = 300;
  const total = subtotal + deliveryFee;

  /* =========================
     PLACE ORDER (FIXED)
  ========================= */
  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!county || !town) {
      setError("Please provide your delivery location.");
      return;
    }

    if (paymentMethod !== "cash") {
      setError("Only Cash on Delivery is available right now.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/orders", {
        county,
        town,
        paymentMethod: "COD", // ✅ MATCH BACKEND
        notes: "Cash on delivery",
        smsUpdatesEnabled: true,
      });

      clearCart();
      navigate("/success");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 text-gray-800 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-amber-700 mb-4">Checkout</h1>

      {/* Trust Message */}
      <div className="max-w-2xl w-full mb-6 bg-amber-100 border border-amber-300 rounded-xl p-4 text-sm text-amber-800">
        🤝 <strong>Cash on Delivery</strong>
        <br />
        Online payments will be enabled soon.
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center mt-16">
          <p className="text-lg mb-4 text-gray-600">Your cart is empty.</p>
          <Link
            to="/shop"
            className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg border border-amber-200">
          {/* Cart Summary */}
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b border-amber-100 py-3"
            >
              <p className="font-medium text-gray-800">
                {item.name} × {item.qty}
              </p>
              <span className="text-amber-700 font-semibold">
                Ksh {(item.price * item.qty).toLocaleString()}
              </span>
            </div>
          ))}

          {/* Totals */}
          <div className="mt-4 space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Ksh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>Ksh {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-amber-100 pt-2">
              <span>Total:</span>
              <span className="text-amber-700 text-lg">
                Ksh {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Select County
            </label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="border border-amber-300 rounded-lg px-3 py-2 w-full"
            >
              <option value="">-- Select County --</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-amber-700 mt-4 mb-2">
              Town / Area
            </label>
            <input
              type="text"
              value={town}
              onChange={(e) => setTown(e.target.value)}
              placeholder="e.g. Westlands"
              className="border border-amber-300 rounded-lg px-3 py-2 w-full"
            />
          </div>

          {/* Payment */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border border-amber-300 rounded-lg px-3 py-2 w-full"
            >
              <option value="cash">Cash on Delivery</option>
              <option value="mpesa" disabled>M-Pesa (Coming Soon)</option>
              <option value="stripe" disabled>Card (Coming Soon)</option>
            </select>
          </div>

          {error && <p className="text-red-500 mt-3">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="bg-amber-500 text-white w-full py-3 mt-8 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
