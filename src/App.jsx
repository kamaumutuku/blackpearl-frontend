import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* 🌐 Public */
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Success from "./pages/Success";
import ProductDetails from "./pages/ProductDetails"
import AgeGate from "./pages/AgeGate";

/* 👥 Auth */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* 👤 User */
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

/* 🧱 Admin */
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminLayout from "./layouts/AdminLayout";

/* 🧩 Shared */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

/* 🧠 Auth */
import { useAuth } from "./context/UserAuthContext";

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const verified = localStorage.getItem("blackpearl-age-verified");

  /* 🚫 AGE GATE FIRST */
  if (!verified) return <AgeGate />;

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-gray-900">
      {!isAdminRoute && <Navbar />}

      <main className={`${!isAdminRoute ? "pt-20" : ""} flex-grow`}>
        <Routes>
          {/* 🌐 PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />

          {/* 👥 AUTH */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/shop"} />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/shop" />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 👤 USER ROUTES (BLOCK ADMINS) */}
          <Route
            path="/profile"
            element={
              user && !isAdmin ? <Profile /> : <Navigate to={isAdmin ? "/admin" : "/login"} />
            }
          />
          <Route
            path="/cart"
            element={
              user && !isAdmin ? <Cart /> : <Navigate to={isAdmin ? "/admin" : "/login"} />
            }
          />
          <Route
            path="/checkout"
            element={
              user && !isAdmin ? <Checkout /> : <Navigate to={isAdmin ? "/admin" : "/login"} />
            }
          />

          {/* 🧱 ADMIN ROUTES */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Route>

          {/* 🔁 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
