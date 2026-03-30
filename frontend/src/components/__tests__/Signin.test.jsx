import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signin from "../Signin";

const mockLogin = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Signin Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignin = () => {
    return render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>,
    );
  };

  it("renders the signin form correctly", () => {
    renderSignin();

    expect(screen.getByText("Missouri Medicaid Login")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute("href", "/signup");
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

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("submit-button");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Get the form element directly instead of by role
    const form = document.querySelector("form");
    fireEvent.submit(form);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Signing In...");
  });

  it("handles successful login", async () => {
    mockLogin.mockResolvedValue({ success: true, data: { success: true, role: "Applicant" } });

    renderSignin();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    const form = document.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/applicant/dashboard", { replace: true });
    });
  });

  it("handles login error", async () => {
    const errorMessage = "Invalid credentials";
    mockLogin.mockRejectedValue({ message: errorMessage });

    renderSignin();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "wrongpassword");

    const form = document.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        errorMessage,
      );
    });
  });

  it("disables inputs during loading", async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    renderSignin();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    const form = document.querySelector("form");
    fireEvent.submit(form);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });
});
