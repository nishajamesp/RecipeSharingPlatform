import express from "express";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favouriteController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getFavourites);
router.post("/:recipeId", protect, addFavourite);
router.delete("/:recipeId", protect, removeFavourite);

export default router;
