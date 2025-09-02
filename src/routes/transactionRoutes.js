import express from 'express'
import { getTransactionsByUserId, createTransaction, deleteTransaction } from "../controllers/transactionsControllers.js"

const router = express.Router()
// Get transaction by userid
router.get('/:userId', getTransactionsByUserId);

// Submit a transaction
router.post('/', createTransaction);

// Delete a transaction by ID
router.delete('/:id', deleteTransaction);

export default router
