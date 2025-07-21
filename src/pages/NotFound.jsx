import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-[10rem] font-extrabold leading-none tracking-tight drop-shadow-2xl animate-pulse">
          404
        </h1>
        <p className="text-2xl font-semibold mt-4 mb-6">Oops! Page not found</p>
        <p className="text-md mb-8 text-gray-200">
          The page you're looking for doesn’t exist or was moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
