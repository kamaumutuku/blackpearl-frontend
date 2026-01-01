import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      // ✅ login() MUST return user data (including role)
      const user = await login(phone, password);

      toast.success("Welcome back!");

      // ✅ ROLE-BASED REDIRECT (FIX)
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        "Unable to login. Please check your credentials.";
      toast.error(msg);
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
          Welcome Back
        </h2>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-amber-900 font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="07xx xxx xxx or +2547xx xxx xxx"
            className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-amber-900 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-10 text-gray-500 hover:text-amber-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white font-semibold py-2 rounded-lg hover:bg-amber-700 transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-amber-700 hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2">
            <Link
              to="/forgot-password"
              className="text-gray-500 hover:text-amber-600"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
