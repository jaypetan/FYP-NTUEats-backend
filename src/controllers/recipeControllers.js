import { sql } from '../config/db.js'

export async function getRecipesByUserId(req, res) {
    try {
        const { userId } = req.params
        const recipes = await sql`
            SELECT * FROM recipes WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `
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

export async function createRecipe(req, res) {
    try {
        const { recipe_id, user_id, title, instructions, ingredients, recipe_pic, timestamp } = req.body

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [recipe] = await sql`
            INSERT INTO recipes (user_id, title, instructions, ingredients, recipe_pic, timestamp) 
            VALUES (${user_id}, ${title}, ${instructions}, ${ingredients}, ${recipe_pic}, ${timestamp})
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

export async function deleteRecipe(req, res) {
    try {
        const { id } = req.params
        const result = await sql`
            DELETE FROM recipes WHERE id = ${id}
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
