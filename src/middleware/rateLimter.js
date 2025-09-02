import ratelimter from '../config/upstash.js'

const rateLimiter = async (req, res, next) => {
    try {
        // Use a constant string to limit all requests with a single ratelimit
        // Or use a userID, apiKey or ip address for individual limits.
        const { success } = await ratelimter.limit('my-rate-limit')

        if (!success) {
            return res.status(429).json({ message: 'Too many requests' })
        }

        next()
    } catch (error) {
        console.error('Error in rate limiter middleware:', error)
        next(error)
    }
}

export default rateLimiter
