import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/icons/mohealthnet1.png";
import { useAuth } from "../../context/AuthContext";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const toggleMenu = () => setIsOpen((prev) => !prev);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // reserved for future dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
  ];
  const authedNavItems = [{ path: "/applicant/dashboard", label: "Dashboard" }];
  const navItems = isAuthenticated ? authedNavItems : publicNavItems;
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      setIsOpen(false);
      navigate("/signin");
    }
  };
  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-[#0078AE] shadow-lg" : "bg-[#0078AE] shadow-md"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={logo}
              alt="MO HealthNet"
              className="w-auto h-10 lg:h-12"
              data-testid="logo"
            />
          </Link>
          <div
            className="hidden items-center space-x-1 lg:flex"
            data-testid="desktop-menu"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
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
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        data-testid="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
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
