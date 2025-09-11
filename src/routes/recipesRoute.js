import express from 'express';
import { getRecipes, createRecipe, setRecipeById, deleteRecipeById } from '../controllers/recipesController.js';

const router = express.Router();

// Get recipes by userId or recipeId
router.get('/', getRecipes);

// Create a new recipe
router.post('/', createRecipe);

// Update a recipe by recipeId
router.put('/:recipeId', setRecipeById);

// Delete a recipe by recipeId
router.delete('/:recipeId', deleteRecipeById);

export default router;