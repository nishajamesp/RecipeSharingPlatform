import User from "../models/User.js";
import Recipe from "../models/Recipe.js";

// @route  GET /api/favourites  (protected)
export const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favourites");
    res.json({ success: true, favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/favourites/:recipeId  (protected)
// Any logged-in user can favourite any recipe
export const addFavourite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const user = await User.findById(req.user._id);
    if (user.favourites.map(id => id.toString()).includes(recipe._id.toString())) {
      return res.status(400).json({ success: false, message: "Recipe already in favourites" });
    }

    // Use $push — does NOT trigger the pre('save') bcrypt hook
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { favourites: recipe._id } },
      { new: true }
    );

    res.status(201).json({ success: true, message: "Added to favourites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/favourites/:recipeId  (protected)
export const removeFavourite = async (req, res) => {
  try {
    // Use $pull — does NOT trigger the pre('save') bcrypt hook
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favourites: req.params.recipeId } },
      { new: true }
    );

    res.json({ success: true, message: "Removed from favourites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
