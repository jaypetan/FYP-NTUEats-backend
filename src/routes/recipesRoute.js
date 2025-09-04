import express from 'express';
import { getRecipesByUserId, createRecipe, setRecipeByRecipeId, deleteRecipe } from '../controllers/recipesControllers.js';

const router = express.Router();

// Get recipes by userId or recipeId
router.get('/', getRecipesByUserId);

// Create a new recipe
router.post('/', createRecipe);

// Update a recipe by recipeId
router.put('/', setRecipeByRecipeId);

// Delete a recipe by recipeId
router.delete('/', deleteRecipe);

export default router;