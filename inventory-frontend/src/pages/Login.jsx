import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user.role === ROLES.ADMIN ? "/admin" : "/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login(form.email, form.password);
      const redirectTo =
        location.state?.from ||
        (loggedInUser.role === ROLES.ADMIN ? "/admin" : "/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Inventory Management
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text-primary">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Sign in to your inventory account
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-primary">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-navy underline underline-offset-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}