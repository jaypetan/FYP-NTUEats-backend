import express from 'express';
import { getStallById, createStall, setStallById, deleteStallById } from '../controllers/stallsController.js';

const router = express.Router();

// Get stall by stallId
router.get('/:stallId', getStallById);

// Create a new stall
router.post('/', createStall);

// Update a stall by stallId
router.put('/:stallId', setStallById);

// Delete a stall by stallId
router.delete('/:stallId', deleteStallById);

export default router;