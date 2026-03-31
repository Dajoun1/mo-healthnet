import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "../Navbar";

let mockIsAuthenticated = false;
const mockLogout = vi.fn();

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    logout: mockLogout,
  }),
}));

// Mock heroicons
vi.mock("@heroicons/react/24/outline", () => ({
  Bars3Icon: () => <div data-testid="menu-icon">Menu Icon</div>,
  XMarkIcon: () => <div data-testid="close-icon">Close Icon</div>,
}));

describe("Navbar Component", () => {
  const resetAuthState = () => {
    mockIsAuthenticated = false;
    mockLogout.mockClear();
  };

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
  };

  it("renders the navbar with logo and desktop menu", () => {
    resetAuthState();
    renderNavbar();

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-menu")).toBeInTheDocument();

    // Use getAllByText and check first element (desktop version)
    expect(screen.getAllByText("Home")[0]).toBeInTheDocument();
    expect(screen.getAllByText("About")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sign In")[0]).toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });

  it("mobile menu is hidden by default", () => {
    resetAuthState();
    renderNavbar();

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toHaveClass("hidden");
  });

  it("toggles mobile menu when button is clicked", () => {
    resetAuthState();
    renderNavbar();

    const menuButton = screen.getByTestId("mobile-menu-button");
    const mobileMenu = screen.getByTestId("mobile-menu");

    // Initially hidden
    expect(mobileMenu).toHaveClass("hidden");

    // Click to open
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass("block");
    expect(mobileMenu).not.toHaveClass("hidden");

    // Click to close
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass("hidden");
    expect(mobileMenu).not.toHaveClass("block");
  });

  it("closes mobile menu when a nav link is clicked", () => {
    resetAuthState();
    renderNavbar();

    const menuButton = screen.getByTestId("mobile-menu-button");
    const mobileMenu = screen.getByTestId("mobile-menu");

    // Open menu
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass("block");

    // Click a nav link in mobile menu
    const mobileHomeLinks = screen.getAllByText("Home");
    fireEvent.click(mobileHomeLinks[1]); // Second one is mobile

    // Menu should close
    expect(mobileMenu).toHaveClass("hidden");
  });

  it("has correct navigation links", () => {
    resetAuthState();
    renderNavbar();

    const homeLinks = screen.getAllByText("Home");
    const aboutLinks = screen.getAllByText("About");
    const signinLinks = screen.getAllByText("Sign In");

    // Should have both desktop and mobile links
    expect(homeLinks).toHaveLength(2);
    expect(aboutLinks).toHaveLength(2);
    expect(signinLinks).toHaveLength(2);
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();

    // Check hrefs
    expect(homeLinks[0].closest("a")).toHaveAttribute("href", "/");
    expect(aboutLinks[0].closest("a")).toHaveAttribute("href", "/about");
    expect(signinLinks[0]).toHaveAttribute("href", "/signin");
  });

  it("handles active class correctly", () => {
    resetAuthState();
    // Use MemoryRouter to set initial route
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>,
    );

    const homeLinks = screen.getAllByText("Home");

    // Desktop home link should have active class
    expect(homeLinks[0]).toHaveClass("text-white");

    // About link should not have active class
    const aboutLinks = screen.getAllByText("About");
    expect(aboutLinks[0]).toHaveClass("text-gray-700");
  });

  it("shows logout for authenticated users and handles logout action", () => {
    mockIsAuthenticated = true;
    renderNavbar();

    const logoutButtons = screen.getAllByText("Logout");
    expect(logoutButtons.length).toBeGreaterThan(0);

    fireEvent.click(logoutButtons[0]);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
