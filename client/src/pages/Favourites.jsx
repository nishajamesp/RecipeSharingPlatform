import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavourites, removeFavourite } from "../redux/favouriteSlice";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaClock, FaStar } from "react-icons/fa";

function Favourites() {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { items: favourites, loading } = useSelector((state) => state.favourites);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavourites());
    }
  }, [isLoggedIn]);

  const handleRemove = (recipeId) => {
    dispatch(removeFavourite(recipeId));
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-lg font-medium">Please login to see your favourites.</p>
        <Link
          to="/login"
          className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="text-red-500 text-2xl" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Favourites</h2>
            <p className="text-gray-500 text-sm">
              {favourites.length} saved recipe{favourites.length !== 1 ? "s" : ""} for {user?.name}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-orange-400 animate-pulse">Loading your favourites...</div>
        ) : favourites.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">💔</p>
            <p className="text-lg font-medium">No favourites yet.</p>
            <p className="text-sm mb-6">Click the ❤️ on any recipe to save it here.</p>
            <Link to="/" className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm font-medium">
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favourites.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                  <span className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    {recipe.cuisine}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{recipe.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><FaClock className="text-orange-400" /> {recipe.cookingTime} min</span>
                    <span className="flex items-center gap-1 text-yellow-500 font-semibold"><FaStar /> {recipe.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/recipe/${recipe._id}`}
                      className="flex-1 text-center bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                    >
                      View Recipe
                    </Link>
                    <button
                      onClick={() => handleRemove(recipe._id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourites;
