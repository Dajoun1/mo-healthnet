import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signup from "../Signup";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    register: mockRegister,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

describe("Signup Component", () => {
  beforeEach(() => vi.clearAllMocks());

  const renderSignup = () =>
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

  const fillValidForm = async () => {
    await userEvent.type(screen.getByTestId("first-name-input"), "Jane");
    await userEvent.type(screen.getByTestId("last-name-input"), "Doe");
    await userEvent.type(screen.getByTestId("email-input"), "jane@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "secret1");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "secret1");
  };

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it("renders all form fields and the submit button", () => {
    renderSignup();

    expect(screen.getByText("Missouri Medicaid - Create Account")).toBeInTheDocument();
    expect(screen.getByTestId("first-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("last-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("renders a Sign In link", () => {
    renderSignup();
    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signin");
  });

  // ─── Input changes ──────────────────────────────────────────────────────────

  it("updates fields as the user types", async () => {
    renderSignup();
    await fillValidForm();

    expect(screen.getByTestId("first-name-input").value).toBe("Jane");
    expect(screen.getByTestId("last-name-input").value).toBe("Doe");
    expect(screen.getByTestId("email-input").value).toBe("jane@example.com");
    expect(screen.getByTestId("password-input").value).toBe("secret1");
    expect(screen.getByTestId("confirm-password-input").value).toBe("secret1");
  });

  // ─── Validation ────────────────────────────────────────────────────────────

  it("shows an error for an invalid email", async () => {
    renderSignup();
    await userEvent.type(screen.getByTestId("first-name-input"), "Jane");
    await userEvent.type(screen.getByTestId("last-name-input"), "Doe");
    await userEvent.type(screen.getByTestId("email-input"), "not-an-email");
    await userEvent.type(screen.getByTestId("password-input"), "secret1");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "secret1");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Please enter a valid email address.",
      ),
    );
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("shows an error when the password is too short", async () => {
    renderSignup();
    await userEvent.type(screen.getByTestId("first-name-input"), "Jane");
    await userEvent.type(screen.getByTestId("last-name-input"), "Doe");
    await userEvent.type(screen.getByTestId("email-input"), "jane@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "abc");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "abc");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Password must be at least 6 characters.",
      ),
    );
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("shows an error when passwords do not match", async () => {
    renderSignup();
    await userEvent.type(screen.getByTestId("first-name-input"), "Jane");
    await userEvent.type(screen.getByTestId("last-name-input"), "Doe");
    await userEvent.type(screen.getByTestId("email-input"), "jane@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "secret1");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "secret2");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Passwords do not match.",
      ),
    );
  });

  it("shows an error when first name is blank", async () => {
    renderSignup();
    await userEvent.type(screen.getByTestId("last-name-input"), "Doe");
    await userEvent.type(screen.getByTestId("email-input"), "jane@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "secret1");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "secret1");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "First name is required.",
      ),
    );
  });

  it("shows an error when last name is blank", async () => {
    renderSignup();
    await userEvent.type(screen.getByTestId("first-name-input"), "Jane");
    await userEvent.type(screen.getByTestId("email-input"), "jane@example.com");
    await userEvent.type(screen.getByTestId("password-input"), "secret1");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "secret1");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Last name is required.",
      ),
    );
  });

  // ─── Successful registration ────────────────────────────────────────────────

  it("calls register with a lowercase email and correct payload", async () => {
    mockRegister.mockResolvedValue({ success: true });
    renderSignup();
    await userEvent.type(screen.getByTestId("first-name-input"), "Jane");
    await userEvent.type(screen.getByTestId("last-name-input"), "Doe");
    await userEvent.type(screen.getByTestId("email-input"), "Jane@Example.COM");
    await userEvent.type(screen.getByTestId("password-input"), "secret1");
    await userEvent.type(screen.getByTestId("confirm-password-input"), "secret1");

    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "secret1",
        role: "Applicant",
      }),
    );
  });

  it("navigates to /applicant/dashboard after successful registration", async () => {
    mockRegister.mockResolvedValue({ success: true });
    renderSignup();
    await fillValidForm();
    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/applicant/dashboard", {
        replace: true,
      }),
    );
  });

  // ─── Loading state ──────────────────────────────────────────────────────────

  it("shows 'Creating Account...' and disables the button while loading", async () => {
    mockRegister.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200)),
    );
    renderSignup();
    await fillValidForm();
    fireEvent.submit(document.querySelector("form"));

    expect(screen.getByTestId("submit-button")).toHaveTextContent("Creating Account...");
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  it("disables all inputs while loading", async () => {
    mockRegister.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200)),
    );
    renderSignup();
    await fillValidForm();
    fireEvent.submit(document.querySelector("form"));

    expect(screen.getByTestId("first-name-input")).toBeDisabled();
    expect(screen.getByTestId("last-name-input")).toBeDisabled();
    expect(screen.getByTestId("email-input")).toBeDisabled();
    expect(screen.getByTestId("password-input")).toBeDisabled();
    expect(screen.getByTestId("confirm-password-input")).toBeDisabled();
  });

  // ─── Server errors ──────────────────────────────────────────────────────────

  it("displays an error message returned by register", async () => {
    mockRegister.mockResolvedValue({
      success: false,
      error: "Email already in use.",
    });
    renderSignup();
    await fillValidForm();
    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Email already in use.",
      ),
    );
  });

  it("displays a fallback error when register throws", async () => {
    mockRegister.mockRejectedValue(new Error("Network failure"));
    renderSignup();
    await fillValidForm();
    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toHaveTextContent("Network failure"),
    );
  });

  // ─── Error clearing ─────────────────────────────────────────────────────────

  it("clears the error when the user types again", async () => {
    mockRegister.mockResolvedValue({ success: false, error: "Server error" });
    renderSignup();
    await fillValidForm();
    fireEvent.submit(document.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByTestId("error-message")).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByTestId("first-name-input"), "x");
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});

