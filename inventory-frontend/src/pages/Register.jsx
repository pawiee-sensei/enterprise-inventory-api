import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
          Create account
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Registers as Staff. Admin accounts are created separately.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-md bg-success-bg px-3 py-2 text-sm text-success">
            Account created! Redirecting to login...
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-text-primary">
                First name
              </label>
              <Input
                id="first_name"
                name="first_name"
                required
                value={form.first_name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-text-primary">
                Last name
              </label>
              <Input
                id="last_name"
                name="last_name"
                required
                value={form.last_name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

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
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-navy underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}