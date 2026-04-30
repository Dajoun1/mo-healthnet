import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

// Mock useAuth so we control the auth state in each test
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Helper: renders a ProtectedRoute at /protected with an optional fallback
// so we can assert redirects by checking what gets rendered
const renderProtectedRoute = ({ allowedRoles = [], authState = {} } = {}) => {
  useAuth.mockReturnValue({
    user: null,
    isAuthenticated: false,
    loading: false,
    ...authState,
  });

  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div data-testid="protected-content">Protected Content</div>
            </ProtectedRoute>
          }
        />
        {/* Destination routes so redirects actually render something */}
        <Route path="/signin" element={<div data-testid="signin-page">Sign In</div>} />
        <Route path="/applicant/dashboard" element={<div data-testid="applicant-dashboard">Applicant Dashboard</div>} />
        <Route path="/caseworker/dashboard" element={<div data-testid="caseworker-dashboard">Caseworker Dashboard</div>} />
        <Route path="/admin/dashboard" element={<div data-testid="admin-dashboard">Admin Dashboard</div>} />
        <Route path="/" element={<div data-testid="home-page">Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it("shows a loading spinner when auth is loading", () => {
    renderProtectedRoute({ authState: { loading: true, isAuthenticated: false } });

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    // Spinner is rendered via an animated div — check it exists
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  // ── Unauthenticated ────────────────────────────────────────────────────────

  it("redirects to /signin when the user is not authenticated", () => {
    renderProtectedRoute({
      authState: { isAuthenticated: false, user: null },
    });

    expect(screen.getByTestId("signin-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  // ── Authenticated, no role restriction ────────────────────────────────────

  it("renders children when authenticated and no allowedRoles are specified", () => {
    renderProtectedRoute({
      allowedRoles: [],
      authState: {
        isAuthenticated: true,
        user: { role: "Applicant" },
      },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  // ── Role: Applicant ────────────────────────────────────────────────────────

  it("renders children for an Applicant with the correct allowedRole", () => {
    renderProtectedRoute({
      allowedRoles: ["Applicant"],
      authState: { isAuthenticated: true, user: { role: "Applicant" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("redirects Applicant to /applicant/dashboard when role is not allowed", () => {
    renderProtectedRoute({
      allowedRoles: ["Admin"],
      authState: { isAuthenticated: true, user: { role: "Applicant" } },
    });

    expect(screen.getByTestId("applicant-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  // ── Role: Employee / Caseworker ────────────────────────────────────────────

  it("renders children for an Employee when Employee is in allowedRoles", () => {
    renderProtectedRoute({
      allowedRoles: ["Employee"],
      authState: { isAuthenticated: true, user: { role: "Employee" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("treats Employee as Caseworker-equivalent when caseworker is in allowedRoles", () => {
    renderProtectedRoute({
      allowedRoles: ["caseworker"],
      authState: { isAuthenticated: true, user: { role: "Employee" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("redirects Employee to /caseworker/dashboard when role is not allowed", () => {
    renderProtectedRoute({
      allowedRoles: ["Admin"],
      authState: { isAuthenticated: true, user: { role: "Employee" } },
    });

    expect(screen.getByTestId("caseworker-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  // ── Role: Admin ────────────────────────────────────────────────────────────

  it("renders children for an Admin with the correct allowedRole", () => {
    renderProtectedRoute({
      allowedRoles: ["Admin"],
      authState: { isAuthenticated: true, user: { role: "Admin" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("redirects Admin to /admin/dashboard when role is not allowed", () => {
    renderProtectedRoute({
      allowedRoles: ["Applicant"],
      authState: { isAuthenticated: true, user: { role: "Admin" } },
    });

    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  // ── Role normalization (case-insensitive) ──────────────────────────────────

  it("is case-insensitive when matching roles (mixed case user role)", () => {
    renderProtectedRoute({
      allowedRoles: ["admin"],
      authState: { isAuthenticated: true, user: { role: "ADMIN" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("is case-insensitive when matching roles (mixed case allowedRoles)", () => {
    renderProtectedRoute({
      allowedRoles: ["APPLICANT"],
      authState: { isAuthenticated: true, user: { role: "applicant" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  // ── Multiple allowed roles ─────────────────────────────────────────────────

  it("renders children when user role matches one of multiple allowedRoles", () => {
    renderProtectedRoute({
      allowedRoles: ["caseworker", "Caseworker", "employee", "Employee"],
      authState: { isAuthenticated: true, user: { role: "Employee" } },
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  // ── Unknown role ───────────────────────────────────────────────────────────

  it("redirects an unknown role to / when role is not allowed", () => {
    renderProtectedRoute({
      allowedRoles: ["Admin"],
      authState: { isAuthenticated: true, user: { role: "unknown" } },
    });

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
});

