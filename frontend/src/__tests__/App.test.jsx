import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Outlet } from "react-router-dom";

// ─── Mock AuthProvider & ProtectedRoute ───────────────────────────────────────
vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock("../components/ProtectedRoute", () => ({
  default: () => null,
}));

// ─── Mock layouts – must render <Outlet> so nested routes mount ───────────────
vi.mock("../layouts/ApplicantLayout", () => ({
  default: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { Outlet: O } = require("react-router-dom");
    return <div data-testid="applicant-layout"><O /></div>;
  },
}));
vi.mock("../layouts/CaseworkerLayout", () => ({
  default: () => {
    const { Outlet: O } = require("react-router-dom");
    return <div data-testid="caseworker-layout"><O /></div>;
  },
}));

// ─── Mock page components ─────────────────────────────────────────────────────
vi.mock("../pages/applicant/Home", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));
vi.mock("../pages/applicant/About", () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));
vi.mock("../components/Signin", () => ({
  default: () => <div data-testid="signin-page">Sign In Page</div>,
}));
vi.mock("../components/Signup", () => ({
  default: () => <div data-testid="signup-page">Sign Up Page</div>,
}));
vi.mock("../pages/applicant/ActionCards", () => ({
  default: () => <div data-testid="action-cards">Action Cards</div>,
}));
vi.mock("../pages/applicant/application form/ApplicationForm", () => ({
  default: () => <div data-testid="application-form">Application Form</div>,
}));
vi.mock("../pages/caseworker/Dashboard", () => ({
  default: () => <div data-testid="caseworker-dashboard">Caseworker Dashboard</div>,
}));

import App from "../App";

const renderApp = (path = "/") => {
  window.history.pushState({}, "", path);
  return render(<App />);
};

describe("App Component", () => {
  it("renders the home page on /", () => {
    renderApp("/");
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders the about page on /about", () => {
    renderApp("/about");
    expect(screen.getByTestId("about-page")).toBeInTheDocument();
  });

  it("renders the signin page on /signin", () => {
    renderApp("/signin");
    expect(screen.getByTestId("signin-page")).toBeInTheDocument();
  });

  it("renders the signup page on /signup", () => {
    renderApp("/signup");
    expect(screen.getByTestId("signup-page")).toBeInTheDocument();
  });
});
