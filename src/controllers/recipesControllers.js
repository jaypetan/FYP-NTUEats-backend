
import { sql } from '../config/db.js'

// GET REQUEST: Get recipes by user ID
export async function getRecipesByUserId(req, res) {
    try {
        const { userId, recipeId } = req.query
        let whereClause = sql``; // empty by default

        // Check for parameters for SQL
        if (userId) {
            whereClause = sql`WHERE user_id = ${userId}`;
        } else if (recipeId) {
            whereClause = sql`WHERE recipe_id = ${recipeId}`;
        }

        // Fetch recipes from database
        const recipes = await sql`
            SELECT * FROM recipes
            ${whereClause}
            ORDER BY created_at DESC
        `;
        
        // Check for empty result
        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found' })
        }
        res.status(200).json(recipes)
    } catch (error) {
        console.error('Error fetching recipes', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// POST REQUEST: Submit a recipe
export async function createRecipe(req, res) {
    try {
        const { user_id, title, instructions, ingredients, recipe_pic} = req.body

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [recipe] = await sql`
            INSERT INTO recipes (user_id, title, instructions, ingredients, recipe_pic) 
            VALUES (${user_id}, ${title}, ${instructions}, ${ingredients}, ${recipe_pic})
            RETURNING *
        `
        res.status(201).json({
            message: 'Recipe created successfully',
            recipe,
        })
    } catch (error) {
        console.error('Error creating recipe', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// PUT REQUEST: Edit a recipe by ID
export async function setRecipeByRecipeId(req, res) {
    try {
        const { recipeId } = req.query
        const { title, instructions, ingredients, recipe_pic } = req.body

        const [recipe] = await sql`
            UPDATE recipes
            SET title = ${title}, instructions = ${instructions}, ingredients = ${ingredients}, recipe_pic = ${recipe_pic}
            WHERE recipe_id = ${recipeId}
            RETURNING *
        `

        // Check if recipe was found and updated
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' })
        }
        res.status(200).json({
            message: 'Recipe updated successfully',
            recipe,
        })
    } catch (error) {
        console.error('Error updating recipe', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// DELETE REQUEST: Delete a recipe
export async function deleteRecipe(req, res) {
    try {
        const { recipeId } = req.query
        const result = await sql`
            DELETE FROM recipes WHERE recipe_id = ${recipeId}
            RETURNING *
        `

        // Check if theres a recipe to delete
        if (result.length === 0) {
            return res.status(404).json({ message: 'Recipe not found' })
        }
        res.status(200).json({ message: 'Recipe deleted successfully' })
    } catch (error) {
        console.error('Error deleting recipe', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
