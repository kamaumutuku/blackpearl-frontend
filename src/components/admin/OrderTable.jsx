// frontend/src/components/admin/OrderTable.jsx
import { useState } from "react";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

/**
 * Must match Order schema ENUM exactly
 */
const ORDER_STATUSES = [
  "PENDING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrderTable({ orders = [], refresh }) {
  const [updatingId, setUpdatingId] = useState(null);

  /* =========================
     UPDATE DELIVERY STATUS
  ========================= */
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await api.put(`/admin/orders/${orderId}/status`, {
        status, // ✅ CORRECT PAYLOAD
      });

      toast.success("Order status updated");
      refresh?.();
    } catch (err) {
      console.error("Update order status error:", err);
      toast.error("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No orders found.
      </p>
    );
  }

  return (
    <div className="bg-white border border-amber-200 rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-amber-100 text-amber-800">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">
                Delivery Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const status =
                order.deliveryStatus || "PENDING";

              return (
                <tr
                  key={order._id}
                  className="border-t border-amber-100 hover:bg-amber-50"
                >
                  {/* ORDER ID */}
                  <td className="p-3 font-mono text-xs">
                    #{order.orderNumber}
                  </td>

                  {/* CUSTOMER */}
                  <td className="p-3">
                    {order.user?.name || "Guest"}
                  </td>

                  {/* PAYMENT */}
                  <td className="p-3 uppercase text-gray-600">
                    {order.paymentMethod || "N/A"}
                  </td>

                  {/* TOTAL */}
                  <td className="p-3 font-semibold text-amber-700">
                    Ksh{" "}
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString()}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <select
                      value={status}
                      disabled={
                        updatingId === order.orderNumber
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        border border-amber-300
                        rounded-md px-2 py-1
                        bg-white text-sm
                        focus:ring-2 focus:ring-amber-400
                        outline-none
                        disabled:opacity-50
                      "
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option
                          key={s}
                          value={s}
                        >
                          {s.charAt(0) +
                            s
                              .slice(1)
                              .toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
