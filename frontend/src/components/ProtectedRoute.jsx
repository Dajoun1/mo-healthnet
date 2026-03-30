import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const normalizeRole = (role) => (role || "").toString().trim().toLowerCase();

const roleMatches = (userRole, allowedRoles = []) => {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  if (normalizedAllowedRoles.includes(normalizedUserRole)) {
    return true;
  }

  // Treat Employee as Caseworker-equivalent for dashboard access.
  if (
    normalizedUserRole === "employee" &&
    normalizedAllowedRoles.includes("caseworker")
  ) {
    return true;
  }

  return false;
};

const getDashboardRouteForRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "applicant") return "/applicant/dashboard";
  if (normalizedRole === "caseworker" || normalizedRole === "employee") {
    return "/caseworker/dashboard";
  }
  return "/";
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !roleMatches(user?.role, allowedRoles)) {
    return <Navigate to={getDashboardRouteForRole(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;