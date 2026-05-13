import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/icons/mohealthnet1.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="bg-[#0078AE] text-white mt-auto">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <img
                src={logo}
                alt="Company Logo"
                className="w-auto h-12 mb-4 brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-100 max-w-xs mx-auto sm:mx-0">
              Providing quality healthcare solutions for everyone.
            </p>
          </div>

          {/* Quick Links - Getting Started */}
          <div className="text-center sm:text-left">
            <h3 className="text-md font-semibold mb-4 text-white relative inline-block sm:inline">
              Getting started
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none w-12 h-0.5 bg-white/30 rounded-full sm:hidden"></span>
            </h3>
            <ul className="space-y-2 mt-4 sm:mt-0">
              {isAuthenticated ? (
                // Authenticated user links
                <>
                  <li>
                    <Link
                      to={user?.role === 'Applicant' ? '/applicant/dashboard' : user?.role === 'Employee' ? '/caseworker/dashboard' : '/admin/dashboard'}
                      className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                    >
                      Home
                    </Link>
                  </li>
                  {user?.role === 'Applicant' && (
                    <>
                      <li>
                        <Link
                          to="/applicant/application"
                          className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                        >
                          Apply now
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/applicant/applications"
                          className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                        >
                          My applications
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/applicant/about"
                          className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                        >
                          About
                        </Link>
                      </li>
                    </>
                  )}
                </>
              ) : (
                // Public/Guest user links
                <>
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signin"
                      className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div className="text-center sm:text-left">
            <h3 className="text-md font-semibold mb-4 text-white relative inline-block sm:inline">
              Resources
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none w-12 h-0.5 bg-white/30 rounded-full sm:hidden"></span>
            </h3>
            <ul className="space-y-2 mt-4 sm:mt-0">
              {[
                { text: 'Program requirements', link: '/applicant/about' },
                { text: 'Contact support', link: '/applicant/support' },
                { text: 'Documentation guide', link: '/applicant/about' },
                { text: 'Eligibility details', link: '/applicant/about' }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-sm text-gray-100 hover:text-white transition-colors inline-block py-1"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex flex-row sm:flex-col space-x-4 sm:space-x-0 sm:space-y-4">
              {[
                { icon: faFacebook, label: 'Facebook' },
                { icon: faTwitter, label: 'Twitter' },
                { icon: faLinkedin, label: 'LinkedIn' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center justify-center sm:justify-start space-x-3 text-gray-100 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon
                    icon={social.icon}
                    className="text-white text-2xl group-hover:scale-110 transition-all duration-200"
                  />
                  <span className="hidden sm:inline text-sm">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-100 text-center sm:text-left">
              &copy; {currentYear} MoHealthNet. All rights reserved.
            </p>
            
            {/* Additional Links for larger screens */}
            <div className="flex space-x-6 text-sm text-gray-100">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;