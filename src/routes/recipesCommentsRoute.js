import express from 'express';
import { getRecipeComments, createRecipeComment, setRecipeCommentById, deleteRecipeCommentById } from '../controllers/recipesCommentsController.js';

const router = express.Router();

// Get recipes by userId or recipeId or commentId
router.get('/', getRecipeComments);

// Create a new recipe
router.post('/', createRecipeComment);

// Update a recipe by commentId
router.put('/:commentId', setRecipeCommentById);

// Delete a recipe by commentId
router.delete('/:commentId', deleteRecipeCommentById);

export default router;