import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import 'dotenv/config'

const ratelimter = new Ratelimit({
    // Load directly from environment variables
    redis: Redis.fromEnv(), 
    // Configure rate limiting 100 requests per 60 seconds
    limiter: Ratelimit.slidingWindow(100, '60 s'),
})

export default ratelimter
