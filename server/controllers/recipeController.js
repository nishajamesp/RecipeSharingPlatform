import Recipe from "../models/Recipe.js";
import cloudinary from "../config/cloudinary.js";

// Helper: convert buffer to base64 data URI and upload to Cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimetype};base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder: "recipehub",
        transformation: [{ width: 800, height: 600, crop: "fill" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// @route  GET /api/recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/recipes/:id
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/recipes  (protected, multipart/form-data)
export const createRecipe = async (req, res) => {
  try {
    const {
      title, cuisine, diet, difficulty,
      cookingTime, rating, description,
      ingredients, steps, timerSeconds,
    } = req.body;

    if (!title || !cuisine || !diet || !difficulty || !cookingTime || !description) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Recipe image is required." });
    }

    // Upload to Cloudinary via base64
    let imageUrl;
    try {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary failed:", uploadError?.message || uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload to Cloudinary failed: " + (uploadError?.message || "Unknown error"),
      });
    }

    const parsedIngredients = JSON.parse(ingredients || "[]");
    const parsedSteps       = JSON.parse(steps       || "[]");

    const recipe = await Recipe.create({
      title,
      image:        imageUrl,
      cuisine,
      diet,
      difficulty,
      cookingTime:  Number(cookingTime),
      rating:       rating ? Number(rating) : 4.0,
      description,
      ingredients:  parsedIngredients,
      steps:        parsedSteps,
      timerSeconds: timerSeconds ? Number(timerSeconds) : 0,
    });

    res.status(201).json({ success: true, message: "Recipe created!", recipe });
  } catch (error) {
    console.error("createRecipe error:", error?.message || error);
    res.status(500).json({ success: false, message: error?.message || "Server error" });
  }
};

// @route  DELETE /api/recipes/:id  (protected)
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
