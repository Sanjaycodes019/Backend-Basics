/*
================================================================================
                        MONGODB + MONGOOSE - COMPLETE NOTES
================================================================================

TABLE OF CONTENTS:
1. What is MongoDB?
2. Mongoose ODM
3. Connection
4. Schema Definition
5. CRUD Operations
6. Query Operations
7. Validation
8. Relationships
9. Middleware/Hooks
10. Common Patterns

================================================================================
1. WHAT IS MONGODB?
================================================================================

MongoDB is a NoSQL document database.

FEATURES:
+ Stores data as JSON-like documents (BSON)
+ No fixed schema (flexible structure)
+ Horizontal scaling
+ Fast read/write operations
+ Good for unstructured/semi-structured data

MONGODB vs SQL:
  SQL: Tables → Rows → Columns
  MongoDB: Collections → Documents → Fields

TERMINOLOGY:
  Database   → Container for collections
  Collection → Group of documents (like table)
  Document   → Single record (like row), stored as BSON
  Field      → Key-value pair in document (like column)

================================================================================
2. MONGOOSE ODM
================================================================================

Mongoose = MongoDB + Object Data Modeling

WHY MONGOOSE?
+ Schema enforcement on flexible MongoDB
+ Type casting
+ Validation
+ Query building
+ Middleware/hooks

INSTALL:
  npm install mongoose

================================================================================
3. CONNECTION
================================================================================

const mongoose = require('mongoose');

// Basic connection
mongoose.connect('mongodb://localhost:27017/mydb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection failed:', err));

// With options (recommended)
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Connection events
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', (err) => console.log('Error:', err));
mongoose.connection.on('disconnected', () => console.log('Disconnected'));

================================================================================
4. SCHEMA DEFINITION
================================================================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema
const userSchema = new Schema({
    // Basic fields
    name: String,
    age: Number,
    
    // With options
    email: {
        type: String,
        required: true,      // Must have value
        unique: true,        // No duplicates
        lowercase: true      // Auto convert to lowercase
    },
    
    password: {
        type: String,
        required: true,
        minlength: 6        // Minimum 6 characters
    },
    
    // With default value
    role: {
        type: String,
        enum: ['user', 'admin'],  // Only these values allowed
        default: 'user'
    },
    
    // Date fields
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // Array
    tags: [String],
    
    // Nested object
    address: {
        street: String,
        city: String,
        zipCode: String
    },
    
    // Reference to other collection
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'        // Reference to Company collection
    }
});

// Create model
const User = mongoose.model('User', userSchema);

================================================================================
5. CRUD OPERATIONS
================================================================================

CREATE (Save new document):

  // Method 1: Create and save separately
  const user = new User({
      name: 'John',
      email: 'john@example.com',
      age: 25
  });
  await user.save();
  
  // Method 2: Create directly (shorter)
  const user = await User.create({
      name: 'John',
      email: 'john@example.com',
      age: 25
  });
  
  // Method 3: Insert many
  await User.insertMany([
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', email: 'jane@example.com' }
  ]);

READ (Find documents):

  // Find all
  const users = await User.find();
  
  // Find by condition
  const users = await User.find({ age: { $gte: 18 } });
  
  // Find one
  const user = await User.findOne({ email: 'john@example.com' });
  
  // Find by ID
  const user = await User.findById('123456789');
  
  // Select specific fields
  const users = await User.find().select('name email -_id');
  
  // Limit results
  const users = await User.find().limit(10).skip(20);
  
  // Sort
  const users = await User.find().sort({ createdAt: -1 }); // -1 = descending

UPDATE:

  // Update one
  await User.updateOne(
      { email: 'john@example.com' },
      { $set: { age: 26 } }
  );
  
  // Update many
  await User.updateMany(
      { role: 'user' },
      { $set: { role: 'member' } }
  );
  
  // Find and update (returns updated doc)
  const user = await User.findByIdAndUpdate(
      '123',
      { age: 26 },
      { new: true }  // Return updated document
  );
  
  // Find one and update
  const user = await User.findOneAndUpdate(
      { email: 'john@example.com' },
      { $inc: { age: 1 } },  // Increment age by 1
      { new: true }
  );

DELETE:

  // Delete one
  await User.deleteOne({ email: 'john@example.com' });
  
  // Delete many
  await User.deleteMany({ role: 'guest' });
  
  // Find and delete
  const user = await User.findByIdAndDelete('123');
  await User.findOneAndDelete({ email: 'john@example.com' });

================================================================================
6. QUERY OPERATORS
================================================================================

COMPARISON:
  $eq    → Equal              { age: { $eq: 25 } }
  $ne    → Not equal          { age: { $ne: 25 } }
  $gt    → Greater than       { age: { $gt: 18 } }
  $gte   → Greater or equal   { age: { $gte: 18 } }
  $lt    → Less than          { age: { $lt: 65 } }
  $lte   → Less or equal      { age: { $lte: 65 } }
  $in    → In array           { role: { $in: ['admin', 'moderator'] } }
  $nin   → Not in array       { role: { $nin: ['banned'] } }

LOGICAL:
  $and   → AND                { $and: [{ age: { $gte: 18 } }, { role: 'user' }] }
  $or    → OR                 { $or: [{ role: 'admin' }, { role: 'moderator' }] }
  $not   → NOT                { age: { $not: { $lt: 18 } } }
  $nor   → NOR                { $nor: [{ role: 'admin' }, { role: 'user' }] }

ELEMENT:
  $exists → Field exists      { email: { $exists: true } }
  $type   → Field type        { age: { $type: 'number' } }

EVALUATION:
  $regex  → Regular expression { name: { $regex: /^John/, $options: 'i' } }
  $text   → Text search        { $text: { $search: 'keyword' } }

EXAMPLE QUERIES:

  // Age between 18 and 65
  User.find({ age: { $gte: 18, $lte: 65 } });
  
  // Name starts with 'J' (case insensitive)
  User.find({ name: { $regex: /^J/, $options: 'i' } });
  
  // Complex: Adult users or admins
  User.find({
      $or: [
          { age: { $gte: 18 } },
          { role: 'admin' }
      ]
  });

================================================================================
7. VALIDATION
================================================================================

BUILT-IN VALIDATORS:

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],  // Custom error message
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age must be realistic']
    }
});

CUSTOM VALIDATOR:

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    }
});

================================================================================
8. RELATIONSHIPS (REFERENCES)
================================================================================

ONE-TO-MANY (User has many Posts):

// Post schema
const postSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'     // Reference to User collection
    }
});

// Create post with author reference
const post = await Post.create({
    title: 'My Post',
    content: 'Content here',
    author: userId
});

// Populate (join) when querying
const posts = await Post.find().populate('author', 'name email');
// Returns posts with full author info instead of just ID

MANY-TO-MANY (Users in many Groups):

const groupSchema = new Schema({
    name: String,
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Populate multiple levels
const groups = await Group.find()
    .populate('members', 'name email')
    .populate('creator', 'name');

================================================================================
9. MIDDLEWARE/HOOKS
================================================================================

PRE HOOKS (run before operation):

userSchema.pre('save', function(next) {
    // 'this' refers to the document being saved
    console.log('About to save:', this.name);
    next();
});

userSchema.pre('save', async function(next) {
    // Hash password before saving
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

POST HOOKS (run after operation):

userSchema.post('save', function(doc) {
    console.log('User saved:', doc.name);
});

AVAILABLE HOOKS:
  init, validate, save, remove
  updateOne, deleteOne, findOneAndUpdate, etc.

================================================================================
10. COMMON PATTERNS
================================================================================

STARTER TEMPLATE:

const mongoose = require('mongoose');

// Connect
mongoose.connect('mongodb://localhost:27017/myapp');

// Define schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Create model
const User = mongoose.model('User', userSchema);

// Use
async function main() {
    const user = await User.create({
        name: 'John',
        email: 'john@example.com'
    });
    console.log(user);
}

main();

PAGINATION PATTERN:

async function getUsers(page = 1, limit = 10) {
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

SEARCH PATTERN:

async function searchUsers(query) {
    return await User.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    });
}

================================================================================
REVISION CHECKLIST
================================================================================

□ MongoDB = document database (BSON)
□ Collection ≈ Table, Document ≈ Row
□ Mongoose adds schema to MongoDB
□ mongoose.connect() for connection
□ new Schema({}) to define structure
□ mongoose.model() creates model
□ .create() to insert
□ .find(), .findOne(), .findById() to read
□ .updateOne(), .findByIdAndUpdate() to update
□ .deleteOne(), .findByIdAndDelete() to delete
□ $gt, $lt, $gte, $lte for comparison
□ $or, $and for logical queries
□ .populate() for joining references
□ pre/post hooks for middleware
□ required, min, max, match for validation

================================================================================
*/

console.log('=== MONGODB + MONGOOSE NOTES FILE ===');
console.log('This file contains inline notes for MongoDB/Mongoose concepts');
console.log('Read the comments above for revision');
console.log('');
console.log('To use this code:');
console.log('1. Install: npm install mongoose');
console.log('2. Ensure MongoDB is running');
console.log('3. Uncomment and run the code sections');
