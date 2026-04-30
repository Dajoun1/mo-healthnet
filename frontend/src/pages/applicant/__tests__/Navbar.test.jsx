import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "../Navbar";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@heroicons/react/24/outline", () => ({
  Bars3Icon: () => <span>☰</span>,
  XMarkIcon: () => <span>✕</span>,
  UserCircleIcon: () => <span data-testid="user-circle-icon" />,
  ChevronDownIcon: () => <span data-testid="chevron-down-icon" />,
  ArrowRightOnRectangleIcon: () => <span data-testid="arrow-right-icon" />,
}));

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    logout: mockLogout,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Navbar Component", () => {
  beforeEach(() => vi.clearAllMocks());

  const renderNavbar = () =>
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

  it("renders the navbar with logo and desktop menu", () => {
    renderNavbar();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-menu")).toBeInTheDocument();
  });

  it("renders public nav items (Home, About) when not authenticated", () => {
    renderNavbar();
    // NavLinks render both in desktop and mobile menus so getAllBy is fine
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
  });

  it("renders Sign In and Sign Up buttons when not authenticated", () => {
    renderNavbar();
    expect(screen.getAllByText("Sign In").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sign Up").length).toBeGreaterThan(0);
  });

  it("mobile menu is hidden by default", () => {
    renderNavbar();
    const mobileMenu = screen.getByTestId("mobile-menu");
    // The mobile menu uses max-h-0 to hide (not the 'hidden' class)
    expect(mobileMenu.className).toContain("max-h-0");
  });

  it("opens mobile menu when the hamburger button is clicked", () => {
    renderNavbar();
    const menuButton = screen.getByTestId("mobile-menu-button");
    fireEvent.click(menuButton);
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu.className).toContain("max-h-screen");
  });

  it("closes mobile menu on second click of the hamburger button", () => {
    renderNavbar();
    const menuButton = screen.getByTestId("mobile-menu-button");
    fireEvent.click(menuButton); // open
    fireEvent.click(menuButton); // close
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu.className).toContain("max-h-0");
  });

  it("navigates to /signin when Sign In is clicked", () => {
    renderNavbar();
    // Desktop Sign In button (first occurrence)
    const signInButtons = screen.getAllByText("Sign In");
    fireEvent.click(signInButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  it("navigates to /signup when Sign Up is clicked", () => {
    renderNavbar();
    const signUpButtons = screen.getAllByText("Sign Up");
    fireEvent.click(signUpButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("Home nav link points to /", () => {
    renderNavbar();
    const homeLink = screen.getAllByText("Home")[0].closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("About nav link points to /about", () => {
    renderNavbar();
    const aboutLink = screen.getAllByText("About")[0].closest("a");
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("Home link is highlighted as active on the home route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>,
    );
    // The active NavLink gets bg-white/20 text-white classes
    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks[0].closest("a").className).toContain("bg-white/20");
  });
});
