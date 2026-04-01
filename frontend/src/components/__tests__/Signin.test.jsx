import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signin from "../Signin";
import { authService } from "../../services/api";

// Mock the authService
vi.mock("../../services/api", () => ({
  authService: {
    login: vi.fn(),
  },
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

    expect(screen.getByText("Applicant Login")).toBeInTheDocument();
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
    authService.login.mockImplementation(
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
    const mockResponse = {
      token: "fake-token",
      user: { email: "test@example.com" },
    };
    authService.login.mockResolvedValue(mockResponse);

    renderSignin();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    const form = document.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles login error", async () => {
    const errorMessage = "Invalid credentials";
    authService.login.mockRejectedValue({ message: errorMessage });

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
    authService.login.mockImplementation(
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
