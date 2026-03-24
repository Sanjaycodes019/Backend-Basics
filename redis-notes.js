/*
================================================================================
                    REDIS CACHING - NOTES
================================================================================

TABLE OF CONTENTS:
1. What is Redis?
2. Redis Setup
3. Basic Operations
4. Caching Patterns
5. Cache Strategies
6. Express Integration

================================================================================
1. WHAT IS REDIS?
================================================================================

- In-memory data store
- Key-value database
- Extremely fast (sub-millisecond latency)
- Used for: caching, sessions, real-time analytics, queues

WHY CACHE?
- Reduce database load
- Faster response times
- Handle traffic spikes
- Save costs on DB queries

INSTALL:
  npm install redis ioredis

================================================================================
2. REDIS SETUP
================================================================================

const Redis = require('ioredis');

// Basic connection
const redis = new Redis({
    host: 'localhost',
    port: 6379
});

// With password
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

// Connection events
redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

================================================================================
3. BASIC OPERATIONS
================================================================================

// SET - store value
await redis.set('key', 'value');

// GET - retrieve value
const value = await redis.get('key');

// SET with expiration (seconds)
await redis.setex('session', 3600, 'user-data');  // Expires in 1 hour

// DELETE
await redis.del('key');

// EXISTS - check if key exists
const exists = await redis.exists('key');  // Returns 0 or 1

// EXPIRE - set TTL on existing key
await redis.expire('key', 300);  // Expires in 5 minutes

// TTL - get remaining time
const ttl = await redis.ttl('key');  // -1: no expiry, -2: doesn't exist

// INCREMENT/DECREMENT
await redis.incr('counter');      // Increment by 1
await redis.incrby('counter', 5); // Increment by 5
await redis.decr('counter');

// LISTS
await redis.lpush('queue', 'item1');  // Add to left
await redis.rpush('queue', 'item2');  // Add to right
await redis.lrange('queue', 0, -1);   // Get all items
await redis.lpop('queue');            // Remove from left

// HASHES (objects)
await redis.hset('user:1', 'name', 'John');
await redis.hset('user:1', 'email', 'john@example.com');
await redis.hgetall('user:1');  // Returns all fields

// SETS (unique values)
await redis.sadd('tags', 'nodejs', 'redis', 'cache');
await redis.smembers('tags');     // Get all members
await redis.sismember('tags', 'nodejs');  // Check membership

================================================================================
4. CACHING PATTERNS
================================================================================

PATTERN 1: Cache Aside (Lazy Loading)

async function getUser(userId) {
    const cacheKey = `user:${userId}`;
    
    // Try cache first
    let user = await redis.get(cacheKey);
    if (user) {
        return JSON.parse(user);  // Cache hit
    }
    
    // Cache miss - get from DB
    user = await User.findById(userId);
    
    // Store in cache
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
    
    return user;
}

PATTERN 2: Write Through (Update cache on write)

async function updateUser(userId, data) {
    // Update DB
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    
    // Update cache
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
    
    return user;
}

PATTERN 3: Write Behind (Async cache update)

async function createUser(data) {
    const user = await User.create(data);
    
    // Queue cache update
    await redis.lpush('cache-queue', JSON.stringify({
        action: 'set',
        key: `user:${user._id}`,
        value: user
    }));
    
    return user;
}

PATTERN 4: Cache Invalidation

async function deleteUser(userId) {
    // Delete from DB
    await User.findByIdAndDelete(userId);
    
    // Invalidate cache
    await redis.del(`user:${userId}`);
    
    // Or invalidate pattern
    const keys = await redis.keys('user:*');
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}

================================================================================
5. CACHE STRATEGIES
================================================================================

TTL (Time To Live):
  - Short TTL for frequently changing data (5-15 min)
  - Long TTL for static data (24+ hours)
  - No TTL for session data (manual delete)

Cache Warming:
  - Pre-populate cache on startup
  - Refresh cache before expiration

Cache Stampede Prevention:
  - Add random jitter to TTL
  - Use mutex lock during cache rebuild

================================================================================
6. EXPRESS MIDDLEWARE
================================================================================

// Cache middleware
const cacheMiddleware = (duration = 300) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        
        const cached = await redis.get(key);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        
        // Override res.json to cache response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            redis.setex(key, duration, JSON.stringify(body));
            return originalJson(body);
        };
        
        next();
    };
};

// Use it
app.get('/api/products', cacheMiddleware(600), async (req, res) => {
    const products = await Product.find();  // Slow DB query
    res.json(products);
});

*/

const Redis = require('ioredis');

// Redis client
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// Cache service
const CacheService = {
    async get(key) {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    },
    
    async set(key, value, ttl = 3600) {
        await redis.setex(key, ttl, JSON.stringify(value));
    },
    
    async delete(key) {
        await redis.del(key);
    },
    
    async getOrSet(key, fetchFn, ttl = 3600) {
        let data = await this.get(key);
        if (data) return data;
        
        data = await fetchFn();
        await this.set(key, data, ttl);
        return data;
    }
};

console.log('=== REDIS CACHING NOTES ===');
console.log('Install: npm install ioredis');
console.log('Redis server required: redis-server');

module.exports = { redis, CacheService };
