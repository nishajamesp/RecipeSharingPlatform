import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../redux/recipeSlice";
import RecipeCard from "../components/RecipeCard";
import FilterBar from "../components/FilterBar";

function Home() {
  const dispatch = useDispatch();
  const { filteredRecipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-orange-500 text-lg font-medium animate-pulse">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-200">
          ⚠️ {error} — Make sure the backend is running on port 5000.
        </div>
      </div>
    );
  }

  return (
    <div>
      <FilterBar />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredRecipes.length === 0 ? (
          <p className="col-span-4 text-center text-gray-400 py-10">No recipes match your filters.</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
