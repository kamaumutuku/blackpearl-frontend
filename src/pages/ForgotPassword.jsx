import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance";

/* =========================
   Helpers
========================= */
const normalizePhone = (phone) => {
  let p = phone.replace(/\s+/g, "");
  if (p.startsWith("0")) return "254" + p.slice(1);
  if (p.startsWith("+")) return p.slice(1);
  return p;
};

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      return toast.error("Please enter your phone number");
    }

    try {
      setLoading(true);

      const normalizedPhone = normalizePhone(phone);

      await api.post("/users/forgot-password", {
        phone: normalizedPhone,
      });

      toast.success("Password reset instructions sent via SMS");
      setPhone("");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(
        err.response?.data?.message ||
          "Unable to send reset SMS. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-amber-100 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-amber-200 shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-serif font-bold text-amber-800 mb-6 text-center">
          Reset Password
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your registered phone number and we’ll send you reset instructions via SMS.
        </p>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-amber-900 font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="07XXXXXXXX"
            className="w-full px-4 py-2 border border-amber-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white font-semibold py-2 rounded-lg hover:bg-amber-700 transition-all"
        >
          {loading ? "Sending SMS..." : "Send Reset SMS"}
        </button>

        {/* Back to login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-amber-700 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
