import express from 'express'
import { getUserById, createUser, setUserById, deleteUserById } from '../controllers/usersController.js'

const router = express.Router()
// Get user by userId
router.get('/:userId', getUserById);

// Submit a user
router.post('/', createUser);

// Edit a user by userId
router.put('/:userId', setUserById);

// Delete a user by userId
router.delete('/:userId', deleteUserById);

export default router
