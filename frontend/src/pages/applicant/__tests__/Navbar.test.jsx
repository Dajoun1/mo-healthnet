import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "../Navbar";

// Mock heroicons
vi.mock("@heroicons/react/24/outline", () => ({
  Bars3Icon: () => <div data-testid="menu-icon">Menu Icon</div>,
  XMarkIcon: () => <div data-testid="close-icon">Close Icon</div>,
}));

describe("Navbar Component", () => {
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
  };

  it("renders the navbar with logo and desktop menu", () => {
    renderNavbar();

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-menu")).toBeInTheDocument();

    // Use getAllByText and check first element (desktop version)
    expect(screen.getAllByText("Home")[0]).toBeInTheDocument();
    expect(screen.getAllByText("About")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Contact")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sign In")[0]).toBeInTheDocument();
  });

  it("mobile menu is hidden by default", () => {
    renderNavbar();

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toHaveClass("hidden");
  });

  it("toggles mobile menu when button is clicked", () => {
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
    renderNavbar();

    const homeLinks = screen.getAllByText("Home");
    const aboutLinks = screen.getAllByText("About");
    const contactLinks = screen.getAllByText("Contact");
    const signinLinks = screen.getAllByText("Sign In");

    // Should have both desktop and mobile links
    expect(homeLinks).toHaveLength(2);
    expect(aboutLinks).toHaveLength(2);
    expect(contactLinks).toHaveLength(2);
    expect(signinLinks).toHaveLength(2);

    // Check hrefs
    expect(homeLinks[0].closest("a")).toHaveAttribute("href", "/");
    expect(aboutLinks[0].closest("a")).toHaveAttribute("href", "/about");
    expect(contactLinks[0].closest("a")).toHaveAttribute("href", "/contact");
    expect(signinLinks[0].closest("a")).toHaveAttribute("href", "/signin");
  });

  it("handles active class correctly", () => {
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
});
