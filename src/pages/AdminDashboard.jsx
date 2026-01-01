import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { RefreshCcw } from "lucide-react";

import api from "../utils/axiosInstance";
import DashboardStats from "../components/admin/DashboardStats";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    pending: 0,
  });

  const [paymentBreakdown, setPaymentBreakdown] = useState({
    cash: 0,
    mpesa: 0,
    stripe: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* =========================
     Fetch dashboard stats
  ========================= */
  const fetchDashboardStats = useCallback(async (showToast = false) => {
    try {
      setError(null);

      const { data } = await api.get("/admin/dashboard");

      setStats({
        orders: Number(data?.totalOrders ?? 0),
        revenue: Number(data?.totalRevenue ?? 0),
        products: Number(data?.totalProducts ?? 0),
        pending: Number(data?.pendingOrders ?? 0),
      });

      setPaymentBreakdown({
        cash: Number(data?.paymentBreakdown?.cash ?? 0),
        mpesa: Number(data?.paymentBreakdown?.mpesa ?? 0),
        stripe: Number(data?.paymentBreakdown?.stripe ?? 0),
      });

      setLastUpdated(new Date());

      if (showToast) toast.success("Dashboard refreshed");
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Failed to load dashboard statistics");
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Black Pearl</title>
        <meta
          name="description"
          content="Admin dashboard for managing orders, products and revenue at Black Pearl."
        />
      </Helmet>

      <div className="p-6 md:p-8 space-y-8 bg-amber-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-700">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of store performance
            </p>

            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchDashboardStats(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-amber-300 text-amber-700
                       hover:bg-amber-100 transition"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-gray-500">Loading dashboard…</div>
        ) : (
          <>
            {/* Stats */}
            <DashboardStats stats={stats} />

            {/* Payment Breakdown */}
            <div className="bg-white rounded-2xl shadow border border-amber-200 p-6">
              <h2 className="text-xl font-semibold text-amber-700 mb-4">
                Payment Methods
              </h2>

              <div className="space-y-3 text-gray-700">
                <PaymentRow
                  label="Cash on Delivery"
                  value={paymentBreakdown.cash}
                />
                <PaymentRow
                  label="M-Pesa"
                  value={paymentBreakdown.mpesa}
                />
                <PaymentRow
                  label="Stripe"
                  value={paymentBreakdown.stripe}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* =========================
   SMALL LOCAL UI
========================= */

function PaymentRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-amber-100 pb-2 last:border-b-0">
      <span>{label}</span>
      <span className="font-semibold">
        Ksh {Number(value || 0).toLocaleString()}
      </span>
    </div>
  );
}
