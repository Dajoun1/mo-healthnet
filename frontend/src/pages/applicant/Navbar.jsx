import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/icons/mohealthnet1.png";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

8  // Authenticated users' "Home" is the dashboard, not the marketing landing page.
  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
  ];

  const authedNavItems = [
    { path: "/applicant/dashboard", label: "Dashboard" },
  ];

  const navItems = isAuthenticated ? authedNavItems : publicNavItems;

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      setIsOpen(false);
      navigate("/signin");
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full shadow-md bg-[#0078AE]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/applicant/dashboard" : "/"} className="flex items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="w-auto h-12"
              data-testid="logo"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden space-x-8 md:flex" data-testid="desktop-menu">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive ? "text-white" : "text-gray-700 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleAuthAction}
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 rounded-md hover:text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 rounded-md hover:text-white"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 rounded-md md:hidden hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            data-testid="mobile-menu-button"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" data-testid="close-icon" />
            ) : (
              <Bars3Icon className="w-6 h-6" data-testid="menu-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        data-testid="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleAuthAction}
              className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 transition-colors duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              onClick={toggleMenu}
              className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 transition-colors duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
