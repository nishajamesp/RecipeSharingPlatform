// dotenv MUST be first — before any other imports that read process.env
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favourites", favouriteRoutes);

app.get("/", (req, res) => {
  res.json({ message: "RecipeHub API is running ✅" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
