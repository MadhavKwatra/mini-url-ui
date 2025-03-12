import { Link } from "react-router";
import Navbar from "../components/layout/Navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-grow items-center justify-center px-6 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
          <p className="mt-2 text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="mt-1 text-gray-500">
            You may have mistyped the address or the page may have moved.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white! text-lg font-medium rounded-lg shadow-md 
            hover:bg-primary-700 transition duration-300"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
