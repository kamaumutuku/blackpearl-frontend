import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.post(`/users/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successful. You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(
        err.response?.data?.message ||
          "Password reset failed. Please try again."
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
          Set New Password
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {/* New Password */}
        <div className="mb-4 relative">
          <label className="block text-amber-900 font-medium mb-2">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-amber-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-10 text-gray-500 hover:text-amber-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-amber-900 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-amber-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white font-semibold py-2 rounded-lg hover:bg-amber-700 transition-all"
        >
          {loading ? "Resetting..." : "Reset Password"}
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
