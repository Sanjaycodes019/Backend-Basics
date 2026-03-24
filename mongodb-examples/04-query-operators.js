const mongoose = require('mongoose');

// Connect
mongoose.connect('mongodb://localhost:27017/demo');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ================= QUERY OPERATORS =================

async function queryExamples() {
    
    // 1. COMPARISON OPERATORS
    // $eq, $ne, $gt, $gte, $lt, $lte
    
    const adults = await User.find({ age: { $gte: 18 } });
    const minors = await User.find({ age: { $lt: 18 } });
    const specificAge = await User.find({ age: { $eq: 25 } });
    const notAdmin = await User.find({ role: { $ne: 'admin' } });
    
    // Range query (18 to 65)
    const workingAge = await User.find({
        age: { $gte: 18, $lte: 65 }
    });
    
    // 2. IN / NOT IN
    const staff = await User.find({
        role: { $in: ['admin', 'moderator', 'editor'] }
    });
    
    const regularUsers = await User.find({
        role: { $nin: ['admin', 'moderator'] }
    });
    
    // 3. LOGICAL OPERATORS
    // $or, $and, $not, $nor
    
    const orQuery = await User.find({
        $or: [
            { age: { $lt: 18 } },
            { role: 'admin' }
        ]
    });
    
    const andQuery = await User.find({
        $and: [
            { age: { $gte: 18 } },
            { role: 'user' }
        ]
    });
    // Same as: { age: { $gte: 18 }, role: 'user' }
    
    // 4. REGEX (TEXT SEARCH)
    
    // Starts with (case insensitive)
    const startsWithJ = await User.find({
        name: { $regex: /^J/, $options: 'i' }
    });
    
    // Contains word
    const containsJohn = await User.find({
        name: { $regex: 'john', $options: 'i' }
    });
    
    // Ends with
    const endsWithDoe = await User.find({
        name: { $regex: /doe$/, $options: 'i' }
    });
    
    // 5. ELEMENT OPERATORS
    
    // Field exists
    const hasAge = await User.find({
        age: { $exists: true }
    });
    
    // Field type
    const stringRoles = await User.find({
        role: { $type: 'string' }
    });
    
    console.log('Query examples executed');
}

// ================= ADVANCED QUERIES =================

async function advancedQueries() {
    
    // 1. SELECT SPECIFIC FIELDS
    const namesOnly = await User.find()
        .select('name email');       // Include
    
    const withoutId = await User.find()
        .select('-_id -__v');        // Exclude
    
    // 2. SORTING
    const byAge = await User.find().sort({ age: 1 });      // Ascending
    const byDate = await User.find().sort({ createdAt: -1 }); // Descending
    const multiSort = await User.find().sort({ role: 1, age: -1 });
    
    // 3. PAGINATION
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const paginated = await User.find()
        .skip(skip)
        .limit(limit);
    
    // 4. COUNT
    const total = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    // 5. DISTINCT
    const uniqueRoles = await User.distinct('role');
    
    // 6. FIND ONE AND UPDATE/DELETE
    const updated = await User.findOneAndUpdate(
        { email: 'john@example.com' },
        { $set: { age: 30 } },
        { new: true, upsert: true }  // Return new, create if not exists
    );
    
    console.log('Advanced queries executed');
}

// ================= COMPLEX EXAMPLE =================

async function complexSearch() {
    const results = await User.find({
        $and: [
            {
                $or: [
                    { name: { $regex: 'john', $options: 'i' } },
                    { email: { $regex: 'john', $options: 'i' } }
                ]
            },
            { age: { $gte: 18, $lte: 65 } },
            { role: { $in: ['user', 'member'] } }
        ]
    })
    .select('name email age role')
    .sort({ createdAt: -1 })
    .limit(20);
    
    return results;
}

// queryExamples();
// advancedQueries();

module.exports = { User, complexSearch };
