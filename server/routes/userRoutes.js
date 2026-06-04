import express from 'express';
import { registerUser, loginUser, getUserProfile, saveRecipe, getSavedRecipes } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',        registerUser);
router.post('/login',           loginUser);
router.get('/profile',          protect, getUserProfile);
router.post('/save/:recipeId',  protect, saveRecipe);
router.get('/saved',            protect, getSavedRecipes);

export default router;