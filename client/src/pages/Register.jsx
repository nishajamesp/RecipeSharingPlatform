import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
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
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setLocalError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 text-orange-600 text-2xl font-bold mb-2">
          <FaUtensils />
          <span>RecipeHub</span>
        </div>
        <h2 className="text-center text-gray-500 text-sm mb-8">Create your account</h2>

        {displayError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
            { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters" },
            { label: "Confirm Password", name: "confirm", type: "password", placeholder: "Repeat your password" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition mt-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
