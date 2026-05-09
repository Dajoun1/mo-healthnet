import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/icons/mohealthnet1.png";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
  ];

  const authenticatedNavItems = [
    { path: "/applicant/dashboard", label: "Dashboard" },
    { path: "/applicant/applications", label: "My Applications" },
    { path: "/applicant/application", label: "New Application" },
    { path: "/applicant/notes", label: "Notifications" },
  ];

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
    setUserDropdownOpen(false);
    navigate("/signin");
  };

  const handleSignIn = () => {
    setIsOpen(false);
    navigate("/signin");
  };

  const handleSignUp = () => {
    setIsOpen(false);
    navigate("/signup");
  };

  const handleNotificationsClick = () => {
    navigate("/applicant/notes");
  };

  const navItemsToShow = isAuthenticated
    ? authenticatedNavItems
    : publicNavItems;
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Member";

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-[#0078AE] shadow-lg" : "bg-[#0078AE] shadow-md"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/applicant/dashboard" : "/"}
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={logo}
              alt="MO HealthNet"
              className="w-auto h-10 lg:h-12"
              data-testid="logo"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="hidden items-center space-x-1 lg:flex"
            data-testid="desktop-menu"
          >
            {navItemsToShow.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive ? "bg-white/20 text-white shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden items-center space-x-3 lg:flex">
            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                onClick={handleNotificationsClick}
                className="relative p-2 text-white transition-colors rounded-lg hover:bg-white/10"
                title="Notifications"
              >
                <BellIcon className="w-5 h-5" />
              </button>
            )}

            {/* User menu - authenticated */}
            {isAuthenticated ? (
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
                    </div>
                    <div className="py-2">
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 text-sm font-medium text-[#0078AE] bg-white rounded-lg transition-colors hover:bg-gray-100"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-white rounded-lg lg:hidden hover:bg-white/10 focus:outline-none transition-colors"
            data-testid="mobile-menu-button"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        data-testid="mobile-menu"
      >
        <div className="bg-white shadow-lg">
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="w-12 h-12 text-[#0078AE]" />
                <div>
                  <p className="font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">
                    {user?.username || ""}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItemsToShow.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200
                  ${isActive ? "text-[#0078AE] bg-[#0078AE]/5" : "text-gray-700 hover:text-[#0078AE] hover:bg-gray-50"}`
                }
              >
                <BellIcon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-3 mt-2 text-base font-medium text-left text-red-600 transition-colors rounded-lg hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <div className="space-y-2 mt-2">
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-[#0078AE] rounded-lg hover:bg-[#005f8e] transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-[#0078AE] bg-white border-2 border-[#0078AE] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
