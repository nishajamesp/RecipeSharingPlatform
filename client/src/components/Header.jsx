import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearFavourites } from "../redux/favouriteSlice";
import { FaUtensils, FaHeart, FaUserCircle, FaSignOutAlt, FaPlus } from "react-icons/fa";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFavourites());
    navigate("/login");
  };

  return (
    <header className="bg-orange-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition">
          <FaUtensils />
          <span>RecipeHub</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <Link to="/" className="hover:text-orange-200 transition">Home</Link>

              <Link to="/favourites" className="flex items-center gap-1 hover:text-orange-200 transition">
                <FaHeart /> Favourites
              </Link>

              {/* Add Recipe button */}
              <Link to="/add-recipe"
                className="flex items-center gap-1.5 bg-white text-orange-600 px-3 py-1.5 rounded-full font-semibold hover:bg-orange-50 transition">
                <FaPlus /> Add Recipe
              </Link>

              {/* Username */}
              <div className="flex items-center gap-2 bg-orange-700 px-3 py-1.5 rounded-full">
                <FaUserCircle className="text-orange-200" />
                <span className="text-orange-100 text-sm">{user?.name?.split(" ")[0]}</span>
              </div>

              {/* Logout */}
              <button onClick={handleLogout}
                className="flex items-center gap-1 border border-white/40 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-200 transition">Login</Link>
              <Link to="/register"
                className="bg-white text-orange-600 px-4 py-1.5 rounded-full font-semibold hover:bg-orange-50 transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
