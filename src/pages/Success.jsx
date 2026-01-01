import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Success() {
  return (
    <div className="bg-amber-50 text-gray-800 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-2xl shadow-lg border border-amber-200 max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 8 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h1 className="text-3xl font-bold text-amber-700 mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with <span className="text-amber-700 font-semibold">Black Pearl</span>.
          <br />
          Your order is being processed and will be on its way soon.
        </p>

        <Link
          to="/shop"
          className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-300"
        >
          Continue Shopping
        </Link>

        <p className="text-sm text-gray-500 mt-6">
          You can view your order status anytime from your{" "}
          <Link to="/profile" className="text-amber-700 hover:underline">
            profile
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
