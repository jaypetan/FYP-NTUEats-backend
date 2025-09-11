import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js'
// import rateLimiter from './middleware/rateLimter.js'
import recipeRoute from './routes/recipesRoute.js'
import usersRoute from './routes/usersRoute.js'
import recipesCommentsRoute from './routes/recipesCommentsRoute.js'
import stallsRoute from './routes/stallsRoute.js'
import reviewsRoute from './routes/reviewsRoute.js'

dotenv.config()

const app = express()
// app.use(rateLimiter)
app.use(express.json())


const PORT = process.env.PORT || 5001

async function initDB() {
    try {
        // Drop TABLES, NUKE DATABASE
        // await sql`DROP TABLE IF EXISTS reviews CASCADE;`
        // await sql`DROP TABLE IF EXISTS recipe_comments CASCADE;`
        // await sql`DROP TABLE IF EXISTS recipes CASCADE;`
        // await sql`DROP TABLE IF EXISTS stalls CASCADE;`
        // await sql`DROP TABLE IF EXISTS users CASCADE;`

        // Create User Table
        await sql `CREATE TABLE IF NOT EXISTS users(
            user_id SERIAL PRIMARY KEY,
            clerk_id VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        // Create Recipe Table
        await sql`CREATE TABLE IF NOT EXISTS recipes(
            recipe_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            instructions TEXT[] NOT NULL,
            ingredients TEXT[] NOT NULL,
            recipe_pic VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        // Create Recipe Comments Table
        await sql `CREATE TABLE IF NOT EXISTS recipe_comments(
            comment_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            recipe_id INTEGER NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,
            parent_id INTEGER REFERENCES recipe_comments(comment_id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        // Create Stalls Table
        await sql `CREATE TABLE IF NOT EXISTS stalls(
            stall_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            rating DECIMAL(2, 1),
            description TEXT NOT NULL,
            canteen VARCHAR(255) NOT NULL,
            stall_pic VARCHAR(255),
            menu_pic VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        // Create Reviews Table
        await sql `CREATE TABLE IF NOT EXISTS reviews(
            review_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            stall_id INTEGER NOT NULL REFERENCES stalls(stall_id) ON DELETE CASCADE,
            rating DECIMAL(2, 1) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            review_pic VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
        console.log('Database initialized successfully')
    } catch (error) {
        console.log('Error initializing DB', error)
        process.exit(1) //  status code 1 means failure, 0 success
    }
}

app.get('/', (req, res) => {
    res.send("It's working")
})

app.use('/api/users', usersRoute)
app.use('/api/recipes', recipeRoute)
app.use('/api/recipe-comments', recipesCommentsRoute)
app.use('/api/stalls', stallsRoute)
app.use('/api/reviews', reviewsRoute)

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is up! PORT ', PORT)
    })
})

