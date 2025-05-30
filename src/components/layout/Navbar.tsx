import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary-600 font-bold text-xl">
                MiniURL
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Log Out
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white! bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          {isAuthenticated && (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          )}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-base font-medium text-gray-500 hover:text-gray-800"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
