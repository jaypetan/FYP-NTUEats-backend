import express from 'express'
import { getUsersByUserId, setUserByUserId, createUser, deleteUser } from "../controllers/usersController.js"

const router = express.Router()
// Get user by userId
router.get('/', getUsersByUserId);

// Submit a user
router.post('/', createUser);

// Edit a user by userId
router.put('/', setUserByUserId);

// Delete a user by userId
router.delete('/', deleteUser);

export default router
