import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, upload.single("image"), createRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;
