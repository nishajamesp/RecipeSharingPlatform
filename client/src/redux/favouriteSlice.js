import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Fetch favourites from backend
export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/favourites");
      return res.data.favourites;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch favourites");
    }
  }
);

// Add favourite
export const addFavourite = createAsyncThunk(
  "favourites/add",
  async (recipeId, { rejectWithValue }) => {
    try {
      await api.post(`/api/favourites/${recipeId}`);
      return recipeId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add favourite");
    }
  }
);

// Remove favourite
export const removeFavourite = createAsyncThunk(
  "favourites/remove",
  async (recipeId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/favourites/${recipeId}`);
      return recipeId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove favourite");
    }
  }
);

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: {
    items: [],       // array of full recipe objects
    loading: false,
    error: null,
  },
  reducers: {
    clearFavourites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addFavourite.fulfilled, (state, action) => {
        // optimistic update handled via re-fetch in component
      });

    builder
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (r) => r._id !== action.payload
        );
      });
  },
});

export const { clearFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
