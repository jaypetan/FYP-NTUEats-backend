
import { sql } from '../config/db.js'

// GET REQUEST: Get recipe comments by userId or recipeId or commentId
export async function getRecipeComments(req, res) {
    try {
        const { userId, recipeId, commentId } = req.query
        let whereClause = sql``; // empty by default

        // Check for parameters for SQL
        if (userId) {
            whereClause = sql`WHERE user_id = ${userId}`;
        } else if (recipeId) {
            whereClause = sql`WHERE recipe_id = ${recipeId}`;
        } else if (commentId) {
            whereClause = sql`WHERE comment_id = ${commentId}`;
        }

        // Fetch recipe comments from database
        const recipeComments = await sql`
            SELECT * FROM recipe_comments
            ${whereClause}
            ORDER BY created_at DESC
        `;
        
        // Check for empty result
        if (recipeComments.length === 0) {
            return res.status(404).json({ message: 'No recipe comments found' })
        }
        res.status(200).json(recipeComments)
    } catch (error) {
        console.error('Error fetching recipes', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// POST REQUEST: Submit a recipe comment
export async function createRecipeComment(req, res) {
    try {
        const { user_id, recipe_id, parent_id, title, content } = req.body

        if (!title || !content || !user_id || !recipe_id) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [recipeComment] = await sql`
            INSERT INTO recipe_comments (user_id, recipe_id, parent_id, title, content) 
            VALUES (${user_id}, ${recipe_id}, ${parent_id}, ${title}, ${content})
            RETURNING *
        `
        res.status(201).json({
            message: 'Recipe comment created successfully',
            recipeComment,
        })
    } catch (error) {
        console.error('Error creating recipe comment', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// PUT REQUEST: Edit a recipe comment by ID
export async function setRecipeCommentById(req, res) {
    try {
        const { commentId } = req.params
        const { title, content } = req.body

        const [recipeComment] = await sql`
            UPDATE recipe_comments
            SET title = ${title}, content = ${content}
            WHERE comment_id = ${commentId}
            RETURNING *
        `

        // Check if recipe was found and updated
        if (!recipeComment) {
            return res.status(404).json({ message: 'Recipe comment not found' })
        }
        res.status(200).json({
            message: 'Recipe comment updated successfully',
            recipeComment,
        })
    } catch (error) {
        console.error('Error updating recipe comment', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// DELETE REQUEST: Delete a recipe comment by ID
export async function deleteRecipeCommentById(req, res) {
    try {
        const { commentId } = req.params
        const result = await sql`
            DELETE FROM recipe_comments WHERE comment_id = ${commentId}
            RETURNING *
        `

        // Check if theres a recipe to delete
        if (result.length === 0) {
            return res.status(404).json({ message: 'Recipe comment not found' })
        }
        res.status(200).json({ message: 'Recipe comment deleted successfully' })
    } catch (error) {
        console.error('Error deleting recipe comment', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
