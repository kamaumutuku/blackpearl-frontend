import {
  ShoppingCart,
  CreditCard,
  Package,
  Clock,
} from "lucide-react";

/* =========================
   DASHBOARD STATS
========================= */
export default function DashboardStats({ stats }) {
  const isValid =
    stats &&
    typeof stats === "object" &&
    Object.keys(stats).length > 0;

  if (!isValid) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const safeNumber = (val) =>
    Number.isFinite(Number(val)) ? Number(val) : 0;

  const formatCurrency = (val) =>
    `Ksh ${safeNumber(val).toLocaleString()}`;

  /**
   * IMPORTANT:
   * These keys MUST match AdminDashboard.jsx
   */
  const cards = [
    {
      label: "Total Orders",
      value: safeNumber(stats.orders),
      icon: ShoppingCart,
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      icon: CreditCard,
    },
    {
      label: "Products",
      value: safeNumber(stats.products),
      icon: Package,
    },
    {
      label: "Pending Orders",
      value: safeNumber(stats.pending),
      icon: Clock,
    },
  ];

  return (
    <section
      aria-label="Dashboard statistics"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {cards.map(({ label, value, icon: Icon }) => (
        <article
          key={label}
          className="
            bg-white border border-amber-200 rounded-2xl
            p-5 md:p-6 shadow
            flex items-center gap-4
            min-h-[96px]
            hover:shadow-md transition
            focus-within:ring-2 focus-within:ring-amber-400
          "
        >
          {/* Icon */}
          <div
            className="p-3 rounded-full bg-amber-100 text-amber-700 shrink-0"
            aria-hidden="true"
          >
            <Icon size={20} />
          </div>

          {/* Text */}
          <div className="min-w-0">
            <p className="text-sm text-gray-500 truncate">
              {label}
            </p>
            <p
              className="text-xl md:text-2xl font-bold text-gray-800 mt-1 truncate"
              aria-live="polite"
            >
              {value}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}

/* =========================
   SKELETON CARD
========================= */
function SkeletonCard() {
  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-5 md:p-6 shadow animate-pulse flex items-center gap-4 min-h-[96px]">
      <div className="h-12 w-12 rounded-full bg-amber-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-32 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
