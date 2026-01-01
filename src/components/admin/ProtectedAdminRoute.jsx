import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/UserAuthContext";

/**
 * Protect admin-only routes
 * Admins are normal users with role === "admin"
 */
export default function ProtectedAdminRoute() {
  const { user, loading } = useAuth();

  // Still resolving auth (e.g. page refresh)
  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Authorized admin
  return <Outlet />;
}
