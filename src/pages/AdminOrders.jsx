// frontend/src/pages/AdminOrders.jsx
import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import {
  RefreshCcw,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import api from "../utils/axiosInstance";
import OrderTable from "../components/admin/OrderTable";

/* =========================
   UI FILTER OPTIONS
========================= */
const STATUSES = ["All", "Pending", "Dispatched", "Delivered", "Cancelled"];
const PAYMENTS = ["All", "cash", "mpesa", "stripe"];

/* =========================
   MAP → BACKEND ENUMS
========================= */
const STATUS_MAP = {
  Pending: "PENDING",
  Dispatched: "DISPATCHED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
};

const PAYMENT_MAP = {
  cash: "COD",
  mpesa: "MPESA",
  stripe: "STRIPE",
};

/* =========================
   SAFE NUMBER
========================= */
const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  /* =========================
     FILTERS & PAGINATION
  ========================= */
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const limit = 10;

  /* =========================
     FETCH ORDERS
  ========================= */
  const fetchOrders = useCallback(
    async (showToast = false) => {
      try {
        setLoading(true);

        const params = {
          page,
          limit,
        };

        if (status !== "All") {
          params.deliveryStatus = STATUS_MAP[status];
        }

        if (payment !== "All") {
          params.paymentMethod = PAYMENT_MAP[payment];
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        const { data } = await api.get("/admin/orders", { params });

        setOrders(data.orders || []);
        setTotalOrders(data.totalOrders || 0);
        setTotalPages(data.totalPages || 1);

        if (showToast) toast.success("Orders refreshed");
      } catch (err) {
        console.error("Admin orders fetch error:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    },
    [status, payment, search, page]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <Helmet>
        <title>Admin Orders | Black Pearl</title>
      </Helmet>

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-700">
              Orders Management
            </h1>
            <p className="text-gray-600">
              {totalOrders} total orders
            </p>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-amber-300 text-amber-700
                       hover:bg-amber-100"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-amber-200 rounded-xl p-4
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="border border-amber-300 rounded-md px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={payment}
            onChange={(e) => {
              setPage(1);
              setPayment(e.target.value);
            }}
            className="border border-amber-300 rounded-md px-3 py-2"
          >
            {PAYMENTS.map((p) => (
              <option key={p}>{p.toUpperCase()}</option>
            ))}
          </select>

          <div className="lg:col-span-2 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Order number or phone"
              className="w-full pl-9 pr-3 py-2 border border-amber-300 rounded-md"
            />
          </div>
        </div>

        {/* ORDERS */}
        {loading ? (
          <p className="text-gray-500">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">
            No orders match the filters.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const open = expandedId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white border border-amber-200 rounded-2xl shadow"
                >
                  {/* SUMMARY */}
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-mono text-xs text-gray-500">
                        #{order.orderNumber}
                      </p>
                      <p className="font-semibold">
                        {order.user?.name || "Customer"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.paymentMethod} • Ksh{" "}
                        {n(order.totalAmount).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedId(open ? null : order._id)
                      }
                      className="flex items-center gap-1 text-amber-700"
                    >
                      {open ? "Hide" : "View"}
                      {open ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {/* DETAILS */}
                  {open && (
                    <div className="border-t border-amber-200 p-4 space-y-4">
                      {/* ITEMS */}
                      <div>
                        <h3 className="font-semibold text-amber-700 mb-2">
                          Items
                        </h3>

                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 border rounded-lg p-2 mb-2"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-amber-700">
                              Ksh{" "}
                              {n(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* DELIVERY */}
                      <div>
                        <h3 className="font-semibold text-amber-700 mb-1">
                          Delivery
                        </h3>
                        <p className="text-sm">Phone: {order.phone}</p>
                        <p className="text-sm">
                          {order.deliveryAddress}, {order.deliveryCity}
                        </p>
                      </div>

                      {/* TOTALS */}
                      <div className="text-sm border-t pt-2">
                        <p>
                          Subtotal: Ksh{" "}
                          {n(order.subtotal).toLocaleString()}
                        </p>
                        <p>
                          Delivery: Ksh{" "}
                          {n(order.deliveryFee).toLocaleString()}
                        </p>
                        <p className="font-semibold text-amber-700">
                          Total: Ksh{" "}
                          {n(order.totalAmount).toLocaleString()}
                        </p>
                      </div>

                      {/* STATUS CONTROL */}
                      <OrderTable
                        orders={[order]}
                        refresh={fetchOrders}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
