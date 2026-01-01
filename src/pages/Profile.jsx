import { useEffect, useState } from "react";
import { useAuth } from "../context/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Helmet } from "react-helmet";
import api from "../utils/axiosInstance";

const PAGE_SIZE = 5;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [page, setPage] = useState(1);

  /* =========================
     FETCH USER ORDERS
  ========================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */
  const handleDeleteAccount = async () => {
    if (!confirm("Delete your account permanently?")) return;

    try {
      await api.delete("/users/delete");
      toast.success("Account deleted");
      logout();
      navigate("/");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  /* =========================
     TOGGLE ORDER DETAILS
  ========================= */
  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =========================
     NOT LOGGED IN
  ========================= */
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <h2 className="text-2xl font-bold text-amber-700 mb-3">
          Please Log In
        </h2>
        <Link to="/login" className="text-amber-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen">
      <Helmet>
        <title>My Profile | Black Pearl</title>
      </Helmet>

      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-amber-700">My Profile</h1>
            <p className="text-gray-500">Account & order history</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-amber-700 mb-3">
            Account Information
          </h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Phone:</strong> +{user.phone}
          </p>
        </div>

        {/* ORDERS */}
        <div className="bg-white border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-amber-700 mb-4">
            My Orders
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading orders…</p>
          ) : paginatedOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedOrders.map((order) => {
                  const expanded = expandedOrders.includes(order._id);

                  const subtotal =
                    order.items?.reduce(
                      (acc, i) => acc + i.price * i.quantity,
                      0
                    ) || 0;

                  const deliveryFee = order.deliveryFee || 0;
                  const total = subtotal + deliveryFee;

                  const statusBadge =
                    order.deliveryStatus === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.deliveryStatus === "DISPATCHED"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.deliveryStatus === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800";

                  return (
                    <div
                      key={order._id}
                      className="border border-amber-200 rounded-xl p-4 bg-amber-50"
                    >
                      {/* SUMMARY */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-amber-700 font-semibold">
                            Total: Ksh {total.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}
                          >
                            {order.deliveryStatus || "PENDING"}
                          </span>
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="text-amber-600"
                          >
                            {expanded ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </div>
                      </div>

                      {/* DETAILS */}
                      {expanded && (
                        <div className="mt-4 border-t border-amber-200 pt-4 space-y-4 text-sm">
                          <div>
                            <p>
                              <strong>Delivery Address:</strong>{" "}
                              {order.deliveryAddress}
                            </p>
                            <p>
                              <strong>Payment Method:</strong>{" "}
                              {order.paymentMethod}
                            </p>
                          </div>

                          {/* ITEMS */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.product}
                                className="flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                <p className="font-semibold">
                                  Ksh{" "}
                                  {(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* TOTALS */}
                          <div className="border-t border-amber-100 pt-3 space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>Ksh {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery</span>
                              <span>Ksh {deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-amber-700">
                              <span>Total</span>
                              <span>Ksh {total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
