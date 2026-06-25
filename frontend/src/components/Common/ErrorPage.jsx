
import { Link } from 'react-router-dom';

const ErrorPage = ({ 
  title = "Something went wrong", 
  message = "We're having trouble connecting to our servers. Please try again later.",
  showHomeButton = true,
  showRefreshButton = true
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 max-w-lg w-full text-center shadow-xl border border-gray-100">
        {/* Icon */}
        <div className="text-7xl mb-6">
          <span className="inline-block p-4 bg-blue-50 rounded-full">🔧</span>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        
        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRefreshButton && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-sm hover:shadow-md font-medium"
            >
              Try Again
            </button>
          )}
          
          {showHomeButton && (
            <Link
              to="/"
              className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-900 hover:text-blue-900 transition font-medium"
            >
              Go Home
            </Link>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-400 mt-6">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
