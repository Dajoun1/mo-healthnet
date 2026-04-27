﻿import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const normalizeRole = (role) => (role || "").toString().trim().toUpperCase();

const roleMatches = (userRole, allowedRoles = []) => {
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedAllowedRoles = allowedRoles.map((role) =>
    normalizeRole(role),
  );

  if (normalizedAllowedRoles.includes(normalizedUserRole)) {
    return true;
  }

  // Treat EMPLOYEE as caseworker-equivalent for dashboard access
  if (
    normalizedUserRole === "EMPLOYEE" &&
    normalizedAllowedRoles.includes("CASEWORKER")
  ) {
    return true;
  }

  return false;
};

const getDashboardRouteForRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "APPLICANT") return "/applicant/dashboard";
  if (normalizedRole === "EMPLOYEE") {
    return "/caseworker/dashboard";
  }
  if (normalizedRole === "ADMIN") return "/admin/dashboard";
  return "/";
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log("ProtectedRoute - User:", user); // Debug log
  console.log("ProtectedRoute - Allowed roles:", allowedRoles);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !roleMatches(user?.role, allowedRoles)) {
    console.log(`Role mismatch. User role: ${user?.role}, Allowed: ${allowedRoles}`);
    return <Navigate to={getDashboardRouteForRole(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;