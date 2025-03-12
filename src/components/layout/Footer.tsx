import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold">Mini URL</h3>
            <p className="text-gray-400 mt-2 max-w-sm">
              A simple, fast, and secure URL shortener service to help you share
              links easily.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Mini URL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
