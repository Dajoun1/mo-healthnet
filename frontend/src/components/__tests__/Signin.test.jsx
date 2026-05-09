import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signin from "../Signin";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

describe("Signin Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignin = () =>
    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>,
    );

  it("renders the signin form correctly", () => {
    renderSignin();

    expect(screen.getByText("Missouri Medicaid Login")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
  });

  it("handles input changes correctly", async () => {
    renderSignin();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("shows loading state during form submission", async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    renderSignin();

    await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "password123");

    const form = document.querySelector("form");
    fireEvent.submit(form);

    expect(screen.getByTestId("submit-button")).toBeDisabled();
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Signing In...");
  });

  it("handles successful login and navigates to applicant dashboard", async () => {
    mockLogin.mockResolvedValue({
      success: true,
      data: { user: { role: "Applicant" } },
    });

    renderSignin();

    await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "password123");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        "/applicant/dashboard",
        { replace: true },
      );
    });
  });

  it("handles login error", async () => {
    const errorMessage = "Invalid credentials";
    mockLogin.mockResolvedValue({ success: false, error: errorMessage });

    renderSignin();

    await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "wrongpassword");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
    });
  });

  it("disables inputs during loading", async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    renderSignin();

    await userEvent.type(screen.getByTestId("email-input"), "test@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "password123");

    fireEvent.submit(document.querySelector("form"));

    expect(screen.getByTestId("email-input")).toBeDisabled();
    expect(screen.getByTestId("password-input")).toBeDisabled();
  });
});
