import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

// Mock child components
vi.mock("../pages/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../pages/Home", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("../pages/About", () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock("../pages/Contact", () => ({
  default: () => <div data-testid="contact-page">Contact Page</div>,
}));

vi.mock("../components/Signin", () => ({
  default: () => <div data-testid="signin-page">Sign In Page</div>,
}));

describe("App Component", () => {
  it("renders navbar on all routes", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("renders home page on root route", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders about page on /about route", () => {
    window.history.pushState({}, "", "/about");
    render(<App />);
    expect(screen.getByTestId("about-page")).toBeInTheDocument();
  });

  it("renders contact page on /contact route", () => {
    window.history.pushState({}, "", "/contact");
    render(<App />);
    expect(screen.getByTestId("contact-page")).toBeInTheDocument();
  });

  it("renders signin page on /signin route", () => {
    window.history.pushState({}, "", "/signin");
    render(<App />);
    expect(screen.getByTestId("signin-page")).toBeInTheDocument();
  });

  it("has main container with correct padding", () => {
    render(<App />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("pt-16");
  });
});
