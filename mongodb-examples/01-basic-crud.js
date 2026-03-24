const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/demo')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CRUD Operations Examples

// 1. CREATE
async function createUser() {
    const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
    });
    console.log('Created:', user);
}

// 2. READ
async function findUsers() {
    // Find all
    const all = await User.find();
    
    // Find by condition
    const adults = await User.find({ age: { $gte: 18 } });
    
    // Find one
    const user = await User.findOne({ email: 'john@example.com' });
    
    console.log('Found:', user);
}

// 3. UPDATE
async function updateUser() {
    const updated = await User.findOneAndUpdate(
        { email: 'john@example.com' },
        { $set: { age: 26 } },
        { new: true }
    );
    console.log('Updated:', updated);
}

// 4. DELETE
async function deleteUser() {
    const deleted = await User.findOneAndDelete({ email: 'john@example.com' });
    console.log('Deleted:', deleted);
}

// 5. SEARCH with regex
async function searchUsers() {
    const results = await User.find({
        name: { $regex: /^J/, $options: 'i' }
    });
    console.log('Search results:', results);
}

// 6. PAGINATION
async function getUsersPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
}

// Run examples (comment/uncomment as needed)
// createUser();
// findUsers();
// updateUser();
// deleteUser();
// searchUsers();
// getUsersPaginated(1, 5).then(console.log);

module.exports = { User, createUser, findUsers, updateUser, deleteUser };
