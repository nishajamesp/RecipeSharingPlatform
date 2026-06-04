import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite, fetchFavourites } from "../redux/favouriteSlice";
import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaClock } from "react-icons/fa";

function RecipeCard({ recipe }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { items: favourites } = useSelector((state) => state.favourites);

  const isFavourite = favourites.some((f) => f._id === recipe._id);

  const handleFavouriteClick = async () => {
    if (!isLoggedIn) return;
    if (isFavourite) {
      await dispatch(removeFavourite(recipe._id));
    } else {
      await dispatch(addFavourite(recipe._id));
      dispatch(fetchFavourites()); // re-fetch to get full recipe object in state
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
          <span className="flex items-center gap-1">
            <FaClock className="text-orange-400" /> {recipe.cookingTime} min
          </span>
          <span className="flex items-center gap-1 text-yellow-500 font-semibold">
            <FaStar /> {recipe.rating}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/recipe/${recipe._id}`}
            className="flex-1 text-center bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            View Recipe
          </Link>

          {isLoggedIn && (
            <button
              onClick={handleFavouriteClick}
              className={`px-3 py-2 rounded-lg border transition ${
                isFavourite
                  ? "bg-red-50 border-red-300 text-red-500 hover:bg-red-100"
                  : "border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"
              }`}
              title={isFavourite ? "Remove from favourites" : "Add to favourites"}
            >
              <FaHeart />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
