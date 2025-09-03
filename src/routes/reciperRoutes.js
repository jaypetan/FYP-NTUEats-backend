import express from 'express'
import { getRecipesByUserId, createRecipe, deleteRecipe } from "../controllers/recipeControllers.js"

const router = express.Router()
// Get recipe by userId
router.get('/:userId', getRecipesByUserId);

// Submit a recipe
router.post('/', createRecipe);

// Delete a recipe by ID
router.delete('/:recipeId', deleteRecipe);

export default router
