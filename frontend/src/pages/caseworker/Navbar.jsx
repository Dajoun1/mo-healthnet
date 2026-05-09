import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/icons/mohealthnet1.png";

const CaseworkerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const navItems = [
    { path: "/caseworker/dashboard", label: "Dashboard" },
    { path: "/caseworker/cases", label: "Cases" },
    { path: "/caseworker/notes", label: "Notes" },
    { path: "/caseworker/appointments", label: "Appointments" },
    { path: "/caseworker/reports", label: "Reports" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full shadow-md bg-[#0078AE]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/caseworker/dashboard" className="flex items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="w-auto h-12"
            />
            <span className="ml-2 text-white font-semibold">
              Caseworker Portal
            </span>
          </Link>

          <div className="hidden space-x-8 md:flex" data-testid="desktop-menu">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive ? "text-white" : "text-gray-200 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-gray-200 rounded-md hover:text-white"
            >
              Logout
            </button>
          </div>

          <button
            onClick={toggleMenu}
            className="p-2 text-gray-200 rounded-md md:hidden hover:text-white focus:outline-none"
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
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              toggleMenu();
              handleLogout();
            }}
            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-green-600 hover:bg-green-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CaseworkerNavbar;