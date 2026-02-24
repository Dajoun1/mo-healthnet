import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import { authService } from "../../services/api";

// Mock the authService
vi.mock("../../services/api", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, error, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || "no error"}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : "no user"}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <button
        onClick={() => login({ email: "test@test.com", password: "pass" })}
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("provides initial auth state", () => {
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("no error");
    expect(screen.getByTestId("user")).toHaveTextContent("no user");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
  });

  it("loads existing user from localStorage on mount", () => {
    const mockUser = { id: 1, email: "test@test.com" };
    authService.getCurrentUser.mockReturnValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent(
      JSON.stringify(mockUser),
    );
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
  });

  it("handles successful login", async () => {
    const mockResponse = {
      user: { id: 1, email: "test@test.com" },
      token: "fake-token",
    };
    authService.login.mockResolvedValue(mockResponse);
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent(
        JSON.stringify(mockResponse.user),
      );
      expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("handles login error", async () => {
    const errorMessage = "Invalid credentials";
    authService.login.mockRejectedValue({ message: errorMessage });
    authService.getCurrentUser.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent(errorMessage);
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("user")).toHaveTextContent("no user");
    });
  });

  it("handles logout", async () => {
    const mockUser = { id: 1, email: "test@test.com" };
    authService.getCurrentUser.mockReturnValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent(
      JSON.stringify(mockUser),
    );

    await userEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("user")).toHaveTextContent("no user");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
    expect(authService.logout).toHaveBeenCalled();
  });

  it("throws error when useAuth is used outside provider", () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });
});
