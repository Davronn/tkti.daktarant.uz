import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Go Back Home
      </Link>
    </div>
  );
}

export default ErrorPage;
