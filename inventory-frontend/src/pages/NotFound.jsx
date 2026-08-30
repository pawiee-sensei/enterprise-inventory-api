import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
      <FileQuestion size={40} className="text-text-secondary" />
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        Page not found
      </h1>
      <p className="text-sm text-text-secondary">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/login"
        className="mt-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
      >
        Back to login
      </Link>
    </div>
  );
}

export default NotFound;