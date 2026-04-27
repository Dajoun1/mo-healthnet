import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/icons/mohealthnet1.png";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "User Management" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full shadow-md bg-[#0078AE]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin/dashboard" className="flex items-center">
            <img src={logo} alt="Company Logo" className="w-auto h-12" />
            <span className="ml-2 text-white font-semibold">Admin Portal</span>
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-200 hover:text-white">
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0078AE] px-4 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white
                ${isActive ? "text-white font-semibold" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-200 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;


