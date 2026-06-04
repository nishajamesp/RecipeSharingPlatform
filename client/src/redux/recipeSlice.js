import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// ─── Async Thunk: Fetch All Recipes ────────────────────────────────────────
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/recipes");
      return res.data.recipes;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch recipes");
    }
  }
);

// ─── Async Thunk: Create Recipe ─────────────────────────────────────────────
// Accepts a FormData object (includes image file + all fields)
export const createRecipe = createAsyncThunk(
  "recipes/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.recipe; // the newly created recipe from MongoDB
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create recipe");
    }
  }
);

// ─── Helper: apply search + filters ────────────────────────────────────────
function applyFilters(state) {
  const term = state.searchTerm.toLowerCase();
  const { cuisine, diet, difficulty, time } = state.filters;

  state.filteredRecipes = state.recipes.filter((recipe) => {
    const matchesSearch =
      term === "" ||
      recipe.title.toLowerCase().includes(term) ||
      recipe.ingredients.some((i) => i.toLowerCase().includes(term));

    const matchesCuisine = cuisine === "All" || recipe.cuisine === cuisine;
    const matchesDiet    = diet === "All"    || recipe.diet === diet;
    const matchesDiff    = difficulty === "All" || recipe.difficulty === difficulty;
    const matchesTime    = time === "all"    || recipe.cookingTime <= parseInt(time);

    return matchesSearch && matchesCuisine && matchesDiet && matchesDiff && matchesTime;
  });
}

// ─── Slice ──────────────────────────────────────────────────────────────────
const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    recipes: [],
    filteredRecipes: [],
    searchTerm: "",
    filters: { cuisine: "All", diet: "All", difficulty: "All", time: "all" },
    loading: false,       // used for fetchRecipes
    creating: false,      // used for createRecipe
    createSuccess: false, // flag AddRecipe can watch to redirect
    error: null,
    createError: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      applyFilters(state);
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.searchTerm = "";
      state.filters = { cuisine: "All", diet: "All", difficulty: "All", time: "all" };
      state.filteredRecipes = state.recipes;
    },
    // Call this when leaving AddRecipe so the flag is clean next time
    resetCreateStatus: (state) => {
      state.creating = false;
      state.createSuccess = false;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {

    // ── fetchRecipes ──────────────────────────────────────────
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
        state.filteredRecipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createRecipe ──────────────────────────────────────────
    builder
      .addCase(createRecipe.pending, (state) => {
        state.creating = true;
        state.createSuccess = false;
        state.createError = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.creating = false;
        state.createSuccess = true;
        // Prepend the new recipe so it appears first on the home page
        state.recipes.unshift(action.payload);
        state.filteredRecipes.unshift(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export const { setSearchTerm, setFilter, resetFilters, resetCreateStatus } = recipeSlice.actions;
export default recipeSlice.reducer;
