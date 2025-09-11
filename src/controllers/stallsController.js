
import { sql } from '../config/db.js'

// GET REQUEST: Get stall by stallId
export async function getStallById(req, res) {
    try {
        const { stallId } = req.params;

        // Fetch stall from the database
        const stall = await sql`
            SELECT * FROM stalls WHERE stall_id = ${stallId}
        `
        // Check for empty result
        if (stall.length === 0) {
            return res.status(404).json({ message: 'No stall found' })
        }
        res.status(200).json(stall)
    } catch (error) {
        console.error('Error fetching stall', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// POST REQUEST: Submit a stall
export async function createStall(req, res) {
    try {
        const { name, description, canteen, stallPic, menuPic } = req.body
        const rating = 0.0; // Default rating for new stalls

        if (!name || !description || !canteen) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [stall] = await sql`
            INSERT INTO stalls (name, rating, description, canteen, stall_pic, menu_pic) 
            VALUES (${name}, ${rating}, ${description}, ${canteen}, ${stallPic}, ${menuPic})
            RETURNING *
        `
        res.status(201).json({
            message: 'Stall created successfully',
            stall,
        })
    } catch (error) {
        console.error('Error creating stall', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

    // PUT REQUEST: Edit a stall by stallId
export async function setStallById(req, res) {
    try {
        const { stallId } = req.params
        const { name, description, canteen, stallPic, menuPic } = req.body

        const [stall] = await sql`
            UPDATE stalls
            SET name = ${name}, description = ${description}, canteen = ${canteen}, stall_pic = ${stallPic}, menu_pic = ${menuPic}
            WHERE stall_id = ${stallId}
            RETURNING *
        `

        // Check if stall was found and updated
        if (!stall) {
            return res.status(404).json({ message: 'Stall not found' })
        }
        res.status(200).json({
            message: 'Stall updated successfully',
            stall,
        })
    } catch (error) {
        console.error('Error updating stall', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// DELETE REQUEST: Delete a stall by stallId
export async function deleteStallById(req, res) {
    try {
        const { stallId } = req.params
        const result = await sql`
            DELETE FROM stalls WHERE stall_id = ${stallId}
            RETURNING *
        `

        // Check if theres a stall to delete
        if (result.length === 0) {
            return res.status(404).json({ message: 'Stall not found' })
        }
        res.status(200).json({ message: 'Stall deleted successfully' })
    } catch (error) {
        console.error('Error deleting stall', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
