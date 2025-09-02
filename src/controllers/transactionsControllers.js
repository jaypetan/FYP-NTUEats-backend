import { sql } from '../config/db.js'

export async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `
        // Check for empty result
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' })
        }
        res.status(200).json(transactions)
    } catch (error) {
        console.error('Error fetching transactions', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function createTransaction(req, res) {
    try {
        const { title, amount, category, user_id } = req.body

        if (!title || !user_id || !category || !amount) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const [transaction] = await sql`
            INSERT INTO transactions (user_id, title, amount, category) 
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `
        res.status(201).json({
            message: 'Transaction created successfully',
            transaction,
        })
    } catch (error) {
        console.error('Error creating transaction', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params
        const result = await sql`
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *
        `

        // Check if theres a transaction to delete
        if (result.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' })
        }
        res.status(200).json({ message: 'Transaction deleted successfully' })
    } catch (error) {
        console.error('Error deleting transaction', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
