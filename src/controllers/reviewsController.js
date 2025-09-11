
import { sql } from '../config/db.js'

// GET REQUEST: Get reviews by userId/reviewId/stallId
export async function getReviews(req, res) {
    try {
        const { userId, reviewId, stallId } = req.query
        let whereClause = sql``; // empty by default

        // Check for parameters for SQL
        if (userId) {
            whereClause = sql`WHERE user_id = ${userId}`;
        } else if (reviewId) {
            whereClause = sql`WHERE review_id = ${reviewId}`;
        } else if (stallId) {
            whereClause = sql`WHERE stall_id = ${stallId}`;
        }

        // Fetch reviews from database
        const reviews = await sql`
            SELECT * FROM reviews
            ${whereClause}
            ORDER BY created_at DESC
        `;
        
        // Check for empty result
        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found' })
        }
        res.status(200).json(reviews)
    } catch (error) {
        console.error('Error fetching reviews', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// POST REQUEST: Submit a review
export async function createReview(req, res) {
    try {
        const { user_id, stall_id, rating, title, content, review_pic } = req.body

        if (!title || !content || !stall_id || !user_id || !rating) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [review] = await sql`
            INSERT INTO reviews (user_id, stall_id, rating, title, content, review_pic) 
            VALUES (${user_id}, ${stall_id}, ${rating}, ${title}, ${content}, ${review_pic})
            RETURNING *
        `
        res.status(201).json({
            message: 'Review created successfully',
            review,
        })
    } catch (error) {
        console.error('Error creating review', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// PUT REQUEST: Edit a review by reviewId
export async function setReviewById(req, res) {
    try {
        const { reviewId } = req.params
        const { title, content, rating, review_pic } = req.body

        const [review] = await sql`
            UPDATE reviews
            SET title = ${title}, content = ${content}, rating = ${rating}, review_pic = ${review_pic}
            WHERE review_id = ${reviewId}
            RETURNING *
        `

        // Check if review was found and updated
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }
        res.status(200).json({
            message: 'Review updated successfully',
            review,
        })
    } catch (error) {
        console.error('Error updating review', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// DELETE REQUEST: Delete a review by reviewId
export async function deleteReviewById(req, res) {
    try {
        const { reviewId } = req.params
        const result = await sql`
            DELETE FROM reviews WHERE review_id = ${reviewId}
            RETURNING *
        `

        // Check if theres a review to delete
        if (result.length === 0) {
            return res.status(404).json({ message: 'Review not found' })
        }
        res.status(200).json({ message: 'Review deleted successfully' })
    } catch (error) {
        console.error('Error deleting review', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
