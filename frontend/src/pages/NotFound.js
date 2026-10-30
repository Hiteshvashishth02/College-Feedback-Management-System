import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-primary-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-4">
            {/* Search Option */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">What can you do?</h3>
              
              <div className="space-y-3">
                <Link
                  to="/"
                  className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </Link>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>
                
                <Link
                  to="/"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Colleges
                </Link>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Still can't find what you're looking for?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Try searching for colleges or contact our support team for assistance.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="/help"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Help Center
                </a>
                <span className="text-gray-300">·</span>
                <a
                  href="/contact"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Links */}
      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm text-gray-700">Home</span>
            </Link>
            <Link
              to="/login"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm text-gray-700">Login</span>
            </Link>
            <Link
              to="/register"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm text-gray-700">Register</span>
            </Link>
            <Link
              to="/admin/login"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm text-gray-700">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
