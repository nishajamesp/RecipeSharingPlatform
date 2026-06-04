import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite, fetchFavourites } from "../redux/favouriteSlice";
import api from "../utils/api";
import {
  FaArrowLeft, FaClock, FaStar, FaHeart, FaRegHeart,
  FaCheckSquare, FaRegSquare, FaPrint, FaPlay, FaPause, FaRedo
} from "react-icons/fa";

// ─── Cooking Timer ──────────────────────────────────────────────────────────
function CookingTimer({ totalSeconds }) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      if (secondsLeft === 0) setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft]);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    clearInterval(intervalRef.current);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (secondsLeft / totalSeconds) * circumference;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col items-center gap-4">
      <h3 className="font-bold text-orange-700 text-lg">⏱ Cooking Timer</h3>
      <div className="relative flex items-center justify-center">
        <svg width="110" height="110" className="-rotate-90">
          <circle cx="55" cy="55" r={radius} fill="none" stroke="#fed7aa" strokeWidth="8" />
          <circle cx="55" cy="55" r={radius} fill="none" stroke="#ea580c" strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <span className="absolute text-2xl font-mono font-bold text-orange-700">{mins}:{secs}</span>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setIsRunning((r) => !r)}
          className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-medium text-sm">
          {isRunning ? <FaPause /> : <FaPlay />}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-full hover:bg-orange-50 transition text-sm">
          <FaRedo /> Reset
        </button>
      </div>
      {secondsLeft === 0 && (
        <p className="text-green-600 font-semibold animate-bounce text-center">🎉 Time's up! Your dish is ready!</p>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { items: favourites } = useSelector((state) => state.favourites);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);

  const isFavourite = recipe && favourites.some((f) => f._id === recipe._id);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/recipes/${id}`);
        setRecipe(res.data.recipe);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFavourite = async () => {
    if (!isLoggedIn) return;
    if (isFavourite) {
      await dispatch(removeFavourite(recipe._id));
    } else {
      await dispatch(addFavourite(recipe._id));
      dispatch(fetchFavourites());
    }
  };

  const toggleIngredient = (i) =>
    setCheckedIngredients((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const toggleStep = (i) =>
    setCompletedSteps((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  if (loading) {
    return <div className="text-center py-20 text-orange-400 animate-pulse">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">🍽️</p>
        <p className="text-lg font-medium mb-4">{error || "Recipe not found."}</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-orange-500 text-white rounded-full text-sm">
          Back to Recipes
        </button>
      </div>
    );
  }

  const difficultyColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-800 mb-6 font-medium transition">
        <FaArrowLeft /> Back to Recipes
      </button>

      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img src={recipe.image} alt={recipe.title} className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{recipe.title}</h1>
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">{recipe.cuisine}</span>
          </div>
          {isLoggedIn && (
            <button onClick={handleFavourite}
              className="bg-white rounded-full p-3 shadow hover:scale-110 transition-transform">
              {isFavourite
                ? <FaHeart className="text-red-500 text-xl" />
                : <FaRegHeart className="text-gray-400 text-xl" />}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Cooking Time", value: `${recipe.cookingTime} min` },
          { label: "Difficulty", value: recipe.difficulty, extra: difficultyColor[recipe.difficulty] },
          { label: "Diet", value: recipe.diet },
          { label: "Rating", value: `${recipe.rating} / 5` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`font-bold text-sm ${stat.extra || "text-gray-700"}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-600 mb-10 leading-relaxed">{recipe.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div>
          <h2 className="text-xl font-bold text-orange-700 mb-4">🛒 Ingredients</h2>
          <p className="text-xs text-gray-400 mb-3">Click an ingredient to check it off</p>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} onClick={() => toggleIngredient(i)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition select-none shadow-sm ${
                  checkedIngredients.includes(i) ? "bg-green-50 text-green-600" : "bg-white hover:bg-orange-50 text-gray-700"
                }`}>
                {checkedIngredients.includes(i)
                  ? <FaCheckSquare className="text-green-500 flex-shrink-0 text-lg" />
                  : <FaRegSquare className="text-gray-300 flex-shrink-0 text-lg" />}
                <span className={checkedIngredients.includes(i) ? "line-through" : ""}>{ing}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3">✅ {checkedIngredients.length} / {recipe.ingredients.length} checked</p>
        </div>
        <CookingTimer totalSeconds={recipe.timerSeconds} />
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold text-orange-700 mb-4">👨‍🍳 Instructions</h2>
        <p className="text-xs text-gray-400 mb-3">Click a step to mark it as done</p>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} onClick={() => toggleStep(i)}
              className={`flex gap-4 p-4 rounded-xl cursor-pointer transition select-none shadow-sm ${
                completedSteps.includes(i) ? "bg-green-50 text-green-600" : "bg-white hover:bg-orange-50 text-gray-700"
              }`}>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                completedSteps.includes(i) ? "bg-green-500 text-white" : "bg-orange-500 text-white"
              }`}>{i + 1}</span>
              <span className={`pt-1 ${completedSteps.includes(i) ? "line-through" : ""}`}>{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-gray-400 mt-3">✅ {completedSteps.length} / {recipe.steps.length} steps done</p>
      </div>

      <div className="text-center">
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition shadow">
          <FaPrint /> Print Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeDetails;
