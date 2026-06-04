import express from 'express';
import { suggestRecipes, substituteIngredient } from '../controllers/aiController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/suggest',     protect, suggestRecipes);
router.post('/substitute',  protect, substituteIngredient);

export default router;