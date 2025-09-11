
import { sql } from '../config/db.js'

// GET REQUEST: Get user by userId
export async function getUserById(req, res) {
    try {
        const { userId } = req.params;

        // Fetch user from the database
        const users = await sql`
            SELECT * FROM users WHERE user_id = ${userId}
        `
        // Check for empty result
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' })
        }
        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching users', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// POST REQUEST: Submit a user
export async function createUser(req, res) {
    try {
        const { clerk_id, username } = req.body

        if (!clerk_id || !username) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [user] = await sql`
            INSERT INTO users (clerk_id, username) 
            VALUES (${clerk_id}, ${username})
            RETURNING *
        `
        res.status(201).json({
            message: 'User created successfully',
            user,
        })
    } catch (error) {
        console.error('Error creating user', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// PUT REQUEST: Edit a user by userId
export async function setUserById(req, res) {
    try {
        const { userId } = req.params
        const { clerk_id, username } = req.body

        const [user] = await sql`
            UPDATE users
            SET clerk_id = ${clerk_id}, username = ${username}
            WHERE user_id = ${userId}
            RETURNING *
        `

        // Check if user was found and updated
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({
            message: 'User updated successfully',
            user,
        })
    } catch (error) {
        console.error('Error updating user', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// DELETE REQUEST: Delete a user by userId
export async function deleteUserById(req, res) {
    try {
        const { userId } = req.params
        const result = await sql`
            DELETE FROM users WHERE user_id = ${userId}
            RETURNING *
        `

        // Check if theres a user to delete
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
