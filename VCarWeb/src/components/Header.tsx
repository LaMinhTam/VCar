import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // console.log("is authenticated", isAuthenticated);

  return (
    <header className="bg-white shadow-md p-4 flex flex-col md:flex-row items-center justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
        <Link to="/" className="flex-shrink-0">
          <img
            src="https://via.placeholder.com/100x50"
            alt="Logo"
            className="h-10"
          />
        </Link>
        <div className="flex items-center ml-auto md:hidden">
          {isAuthenticated && (
            <img
              src="https://via.placeholder.com/40x40"
              alt="Avatar"
              className="h-10 w-10 rounded-full ml-4"
            />
          )}
        </div>
      </div>

      <div className="flex items-center w-full md:w-auto">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md p-2 flex-1 min-w-[200px] md:w-64 lg:w-80"
        />
        {isAuthenticated && (
          <div className="hidden md:flex items-center ml-4 space-x-4">
            <img
              src="https://via.placeholder.com/40x40"
              alt="Settings"
              className="h-10 w-10 rounded-full"
            />
            <img
              src="https://via.placeholder.com/40x40"
              alt="Avatar"
              className="h-10 w-10 rounded-full"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
