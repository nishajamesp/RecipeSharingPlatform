import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
    return () => dispatch(clearError());
  }, [isLoggedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setLocalError("Both fields are required.");
      return;
    }
    dispatch(loginUser({ email: form.email, password: form.password }));
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 text-orange-600 text-2xl font-bold mb-2">
          <FaUtensils />
          <span>RecipeHub</span>
        </div>
        <h2 className="text-center text-gray-500 text-sm mb-8">
          Welcome back! Please login.
        </h2>

        {displayError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition mt-2 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
