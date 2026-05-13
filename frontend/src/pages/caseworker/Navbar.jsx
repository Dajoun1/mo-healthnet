import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/icons/mohealthnet1.png";

const CaseworkerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/signin");
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Caseworker";

  const navItems = [
    { path: "/caseworker/dashboard", label: "Dashboard" },
    { path: "/caseworker/cases", label: "Cases" },
    { path: "/caseworker/notes", label: "Notes" },
    { path: "/caseworker/appointments", label: "Appointments" },
    { path: "/caseworker/reports", label: "Reports" },
    { path: "/caseworker/support", label: "Support" },
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

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center gap-2 px-3 py-2 text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <UserCircleIcon className="w-8 h-8" />
                <span className="text-sm font-medium">{displayName}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.username || ""}
                    </p>
                    <p className="text-xs text-[#0078AE] mt-1 font-medium">
                      Caseworker
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
        <div className="bg-white shadow-lg">
          {/* User Info in Mobile */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-12 h-12 text-[#0078AE]" />
              <div>
                <p className="font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">
                  {user?.username || ""}
                </p>
                <p className="text-xs text-[#0078AE] mt-0.5 font-medium">
                  Caseworker
                </p>
              </div>
            </div>
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "text-[#0078AE] bg-[#0078AE]/5"
                      : "text-gray-700 hover:text-[#0078AE] hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleMenu();
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-3 mt-2 text-base font-medium text-left text-red-600 transition-colors rounded-lg hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CaseworkerNavbar;
