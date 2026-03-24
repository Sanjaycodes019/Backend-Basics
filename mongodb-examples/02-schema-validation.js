const mongoose = require('mongoose');

// Connect
mongoose.connect('mongodb://localhost:27017/demo');

// ================= SCHEMA WITH VALIDATION =================

const userSchema = new mongoose.Schema({
    // Required field
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 chars'],
        maxlength: [50, 'Name too long']
    },
    
    // Email with regex validation
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter valid email']
    },
    
    // Number with range
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Enter valid age']
    },
    
    // Enum validation
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'moderator'],
            message: 'Role must be user, admin, or moderator'
        },
        default: 'user'
    },
    
    // Array
    tags: [String],
    
    // Nested object
    address: {
        street: String,
        city: { type: String, required: true },
        zipCode: String
    },
    
    // Default value
    isActive: {
        type: Boolean,
        default: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true  // Cannot be changed after creation
    }
});

// ================= MIDDLEWARE (HOOKS) =================

// Pre-save hook
userSchema.pre('save', function(next) {
    console.log(`About to save user: ${this.name}`);
    // 'this' refers to the document being saved
    next();
});

// Post-save hook
userSchema.post('save', function(doc) {
    console.log(`User saved: ${doc.name}`);
});

// Pre-update hook
userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

const User = mongoose.model('User', userSchema);

// ================= TEST VALIDATION =================

async function testValidation() {
    try {
        // This will fail validation
        const invalidUser = new User({
            name: 'A',  // Too short (min: 2)
            email: 'invalid-email',
            age: -5    // Negative (min: 0)
        });
        
        await invalidUser.save();
    } catch (err) {
        console.log('Validation Errors:');
        Object.keys(err.errors).forEach(key => {
            console.log(`- ${key}: ${err.errors[key].message}`);
        });
    }
}

async function createValidUser() {
    try {
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            age: 25,
            role: 'admin',
            tags: ['developer', 'nodejs'],
            address: {
                city: 'New York',
                street: '123 Main St'
            }
        });
        console.log('Created:', user);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

// testValidation();
// createValidUser();

module.exports = { User };
