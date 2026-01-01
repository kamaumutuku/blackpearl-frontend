import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import { useCart } from "../context/CartContext";
import {
  Home,
  User,
  ShoppingCart,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/blackpearl-logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount =
    cartItems?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  const handleLogout = async () => {
    await logout?.();
    setMenuOpen(false);
    navigate("/");
  };

  const handleNav = (path) => {
    navigate(path);
    setTimeout(() => setMenuOpen(false), 150);
  };

  return (
    <nav className="bg-white text-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* Logo & Brand */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="BlackPearl Logo"
            className="h-8 w-auto md:h-10 object-contain"
          />
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            Black<span className="text-amber-600">Pearl</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/shop"
            className="hover:text-amber-600 flex items-center gap-1 font-medium"
          >
            <Home size={20} /> Shop
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="hover:text-amber-600 flex items-center gap-1 font-medium"
              >
                <User size={20} /> {user.name}
              </Link>

              <Link
                to="/cart"
                className="relative hover:text-amber-600 flex items-center gap-1 font-medium"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-amber-600 flex items-center gap-1 font-medium"
              >
                <LogIn size={20} /> Login
              </Link>
              <Link
                to="/register"
                className="hover:text-amber-600 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 hover:text-amber-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-In Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white text-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="BlackPearl"
              className="h-8 w-auto object-contain"
            />
            <span className="text-lg font-bold">
              Black<span className="text-amber-600">Pearl</span>
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-800 hover:text-amber-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col px-6 py-6 space-y-6 text-lg font-medium">
          <button
            onClick={() => handleNav("/shop")}
            className="flex items-center gap-3 hover:text-amber-600 text-left"
          >
            <Home size={22} /> Shop
          </button>

          {user ? (
            <>
              <button
                onClick={() => handleNav("/profile")}
                className="flex items-center gap-3 hover:text-amber-600 text-left"
              >
                <User size={22} /> Profile
              </button>

              <button
                onClick={() => handleNav("/cart")}
                className="flex items-center gap-3 hover:text-amber-600 text-left relative"
              >
                <ShoppingCart size={22} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute left-36 bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav("/login")}
                className="flex items-center gap-3 hover:text-amber-600 text-left"
              >
                <LogIn size={22} /> Login
              </button>

              <button
                onClick={() => handleNav("/register")}
                className="hover:text-amber-600 text-left"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
