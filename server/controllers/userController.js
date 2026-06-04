import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper: generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/profile  (protected)
export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

// POST /api/users/save/:recipeId  (protected)
export const saveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedRecipes.includes(req.params.recipeId);

    if (alreadySaved) {
      // Unsave if already saved (toggle)
      user.savedRecipes = user.savedRecipes.filter(
        id => id.toString() !== req.params.recipeId
      );
      await user.save();
      return res.json({ message: 'Recipe unsaved', savedRecipes: user.savedRecipes });
    }

    user.savedRecipes.push(req.params.recipeId);
    await user.save();
    res.json({ message: 'Recipe saved', savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/saved  (protected)
export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedRecipes');
    res.json(user.savedRecipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};