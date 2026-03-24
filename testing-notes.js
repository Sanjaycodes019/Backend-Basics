/*
================================================================================
                    TESTING - JEST NOTES
================================================================================

TABLE OF CONTENTS:
1. Jest Setup
2. Unit Testing
3. Integration Testing
4. Mocking
5. Async Testing
6. Test Structure Best Practices

================================================================================
1. JEST SETUP
================================================================================

INSTALL:
  npm install --save-dev jest supertest

PACKAGE.JSON SCRIPTS:
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }

JEST CONFIG (package.json or jest.config.js):
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testMatch": ["**/*.test.js"]
  }

================================================================================
2. UNIT TESTING
================================================================================

// math.js - Function to test
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) throw new Error('Cannot divide by zero');
    return a / b;
};

module.exports = { add, multiply, divide };

// math.test.js - Tests
const { add, multiply, divide } = require('./math');

describe('Math functions', () => {
    // Test add
    test('adds 1 + 2 to equal 3', () => {
        expect(add(1, 2)).toBe(3);
    });
    
    test('adds negative numbers', () => {
        expect(add(-1, -2)).toBe(-3);
    });
    
    // Test multiply
    test('multiplies 2 * 3 to equal 6', () => {
        expect(multiply(2, 3)).toBe(6);
    });
    
    // Test divide
    test('divides 10 / 2 to equal 5', () => {
        expect(divide(10, 2)).toBe(5);
    });
    
    test('throws error when dividing by zero', () => {
        expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
});

================================================================================
3. EXPRESS INTEGRATION TESTING
================================================================================

Use supertest to test HTTP endpoints without starting server.

// app.js
const express = require('express');
const app = express();
app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const user = { id: Date.now(), ...req.body };
    users.push(user);
    res.status(201).json(user);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

module.exports = app;

// app.test.js
const request = require('supertest');
const app = require('./app');

describe('User API', () => {
    // Clear users before each test
    beforeEach(() => {
        users.length = 0;
    });
    
    describe('GET /users', () => {
        test('returns empty array initially', async () => {
            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });
    
    describe('POST /users', () => {
        test('creates new user', async () => {
            const userData = { name: 'John', email: 'john@example.com' };
            
            const res = await request(app)
                .post('/users')
                .send(userData);
            
            expect(res.status).toBe(201);
            expect(res.body).toMatchObject(userData);
            expect(res.body).toHaveProperty('id');
        });
    });
    
    describe('GET /users/:id', () => {
        test('returns user by id', async () => {
            // First create a user
            const createRes = await request(app)
                .post('/users')
                .send({ name: 'John', email: 'john@example.com' });
            
            const userId = createRes.body.id;
            
            // Then get that user
            const res = await request(app).get(`/users/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('John');
        });
        
        test('returns 404 for non-existent user', async () => {
            const res = await request(app).get('/users/999');
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('User not found');
        });
    });
});

================================================================================
4. MOCKING
================================================================================

Mock external dependencies (DB, APIs, etc.)

// userService.js
const axios = require('axios');

const getUserFromAPI = async (id) => {
    const res = await axios.get(`https://api.example.com/users/${id}`);
    return res.data;
};

module.exports = { getUserFromAPI };

// userService.test.js
const axios = require('axios');
const { getUserFromAPI } = require('./userService');

// Mock axios
jest.mock('axios');

describe('User Service', () => {
    test('fetches user from API', async () => {
        const mockUser = { id: 1, name: 'John' };
        axios.get.mockResolvedValue({ data: mockUser });
        
        const user = await getUserFromAPI(1);
        
        expect(user).toEqual(mockUser);
        expect(axios.get).toHaveBeenCalledWith('https://api.example.com/users/1');
    });
    
    test('handles API error', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));
        
        await expect(getUserFromAPI(1)).rejects.toThrow('Network error');
    });
});

// Manual mocking
const mockFn = jest.fn();
mockFn.mockReturnValue('mocked value');
mockFn.mockReturnValueOnce('first call');  // Only next call

// Spy on existing function
const spy = jest.spyOn(console, 'log');
expect(spy).toHaveBeenCalledWith('expected message');
spy.mockRestore();

================================================================================
5. ASYNC TESTING
================================================================================

// Using async/await (recommended)
test('fetches data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
});

// Using resolves/rejects
test('resolves to value', () => {
    return expect(fetchData()).resolves.toBe('data');
});

test('rejects with error', () => {
    return expect(fetchData()).rejects.toThrow('error');
});

// Using done callback (old style)
test('callback test', (done) => {
    fetchData((err, data) => {
        expect(data).toBeDefined();
        done();
    });
});

================================================================================
6. TEST STRUCTURE BEST PRACTICES
================================================================================

// Good test structure
describe('Feature Name', () => {
    // Setup
    beforeAll(() => {
        // Run once before all tests
    });
    
    beforeEach(() => {
        // Run before each test
    });
    
    // Tests grouped by method
    describe('METHOD /path', () => {
        test('should do X when Y', async () => {
            // Arrange
            const input = { name: 'John' };
            
            // Act
            const result = await functionUnderTest(input);
            
            // Assert
            expect(result).toEqual(expectedOutput);
        });
        
        test('should throw error for invalid input', async () => {
            await expect(functionUnderTest(null)).rejects.toThrow();
        });
    });
    
    // Cleanup
    afterEach(() => {
        // Run after each test
    });
    
    afterAll(() => {
        // Run once after all tests
    });
});

================================================================================
COMMON MATCHERS
================================================================================

// Equality
expect(value).toBe(expected)              // Strict equality (===)
expect(value).toEqual(expected)           // Deep equality
expect(value).toStrictEqual(expected)     // Deep + type checking

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(5)
expect(value).toBeGreaterThanOrEqual(5)
expect(value).toBeLessThan(5)
expect(value).toBeCloseTo(0.3)            // For floats

// Strings
expect(value).toMatch(/pattern/)
expect(value).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(array).toEqual(expect.arrayContaining([1, 2]))

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('key', 'value')
expect(obj).toMatchObject({ key: 'value' })

// Errors
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('error message')

================================================================================
*/

console.log('=== TESTING NOTES ===');
console.log('Install: npm install --save-dev jest supertest');
console.log('Run: npm test');

module.exports = {};
