import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    cuisine: { type: String, required: true },
    diet: { type: String, enum: ["Veg", "Vegan", "Non-Veg"], required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    cookingTime: { type: Number, required: true },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    description: { type: String, required: true },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    timerSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
