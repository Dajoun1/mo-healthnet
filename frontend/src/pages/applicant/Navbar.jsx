import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ClockIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/icons/mohealthnet1.png";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  // Navigation items with icons
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    {
      path: "/Application",
      label: "Application",
      icon: ClipboardDocumentListIcon,
    },
    { path: "/status", label: "Status", icon: ChartBarIcon },
  ];

  // Authenticated nav items
  const authenticatedNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    {
      path: "/my-applications",
      label: "My Applications",
      icon: DocumentTextIcon,
    },
    {
      path: "/submission-status",
      label: "Submission Status",
      icon: ChartBarIcon,
    },
  ];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Verification Due Soon",
      message: "Your 6-month recertification is due in 15 days",
      time: "2 hours ago",
      unread: true,
      icon: ClockIcon,
    },
    {
      id: 2,
      title: "Application Approved",
      message: "Your recent submission has been approved",
      time: "1 day ago",
      unread: false,
      icon: CheckBadgeIcon,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const handleNavigation = (path) => {
    setIsOpen(false);
    setUserDropdownOpen(false);
    navigate(path);
  };

  const navItemsToShow = isAuthenticated ? authenticatedNavItems : navItems;

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-[#0078AE] shadow-lg" : "bg-[#0078AE] shadow-md"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo with animation */}
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

          {/* Desktop Navigation */}
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
                  ${
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right side - Desktop */}
          <div className="hidden items-center space-x-3 lg:flex">
            {/* Notifications - Only for authenticated users */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2 text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <BellIcon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <notif.icon className="w-5 h-5 text-[#0078AE]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button className="w-full text-center text-xs text-[#0078AE] hover:text-[#006699] font-medium py-1">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu - Authenticated */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 px-3 py-2 text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8" />
                  )}
                  <span className="text-sm font-medium">
                    {user?.name || "Member"}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                      <p className="font-semibold text-gray-900">
                        {user?.name || "Member"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.email || "member@mohealthnet.gov"}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Active Member</span>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavigation("/settings")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        Settings
                      </button>
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
              /* Sign In & Sign Up Buttons - Non-authenticated users */
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

      {/* Mobile Menu with improved design */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        data-testid="mobile-menu"
      >
        <div className="bg-white shadow-lg">
          {/* User info in mobile menu when authenticated */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-[#0078AE]"
                  />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-[#0078AE]" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.name || "Member"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "member@mohealthnet.gov"}
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
                  ${
                    isActive
                      ? "text-[#0078AE] bg-blue-50"
                      : "text-gray-700 hover:text-[#0078AE] hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}

            {/* Mobile Notifications Section */}
            {isAuthenticated && notifications.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Notifications
                </p>
                {notifications.slice(0, 2).map((notif) => (
                  <div key={notif.id} className="px-3 py-2">
                    <div className="flex gap-3">
                      <notif.icon className="w-5 h-5 text-[#0078AE] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-600">{notif.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Auth Actions */}
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
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-[#0078AE] rounded-lg transition-colors hover:bg-[#006699]"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-[#0078AE] bg-white border-2 border-[#0078AE] rounded-lg transition-colors hover:bg-gray-50"
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
