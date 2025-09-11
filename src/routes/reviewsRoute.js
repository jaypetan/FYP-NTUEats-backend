import express from 'express';
import { getReviews, createReview, setReviewById, deleteReviewById } from '../controllers/reviewsController.js';

const router = express.Router();

// Get reviews by userId or reviewId or stallId
router.get('/', getReviews);

// Create a new review
router.post('/', createReview);

// Update a review by reviewId
router.put('/:reviewId', setReviewById);

// Delete a review by reviewId
router.delete('/:reviewId', deleteReviewById);

export default router;