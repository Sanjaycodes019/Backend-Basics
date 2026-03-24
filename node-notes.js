/*
================================================================================
                        NODE.JS - COMPLETE NOTES
================================================================================

TABLE OF CONTENTS:
1. What is Node.js?
2. Core Concepts
3. Event Loop
4. Core Modules
5. File System (fs)
6. HTTP Module
7. Path Module
8. Process & Environment
9. NPM Commands
10. Common Patterns

================================================================================
1. WHAT IS NODE.JS?
================================================================================

- JavaScript runtime built on Chrome's V8 engine
- Runs JS outside browser (servers, scripts, tools)
- Event-driven, non-blocking I/O model
- Single-threaded with event loop

WHY NODE.JS?
+ Same language for frontend & backend (JS everywhere)
+ Huge ecosystem (NPM - millions of packages)
+ Fast & scalable (non-blocking I/O)
+ Great for real-time apps (chat, streaming)

================================================================================
2. CORE CONCEPTS
================================================================================

SYNCHRONOUS (BLOCKING):
  - Executes line by line
  - Waits for each operation to complete
  - Easy to read, slower performance

ASYNCHRONOUS (NON-BLOCKING):
  - Doesn't wait for operations
  - Uses callbacks/promises/async-await
  - Better performance, more complex

EXAMPLE COMPARISON:

// Synchronous - BLOCKS
const data = fs.readFileSync('file.txt');
console.log(data);  // waits for file read
console.log('Done'); // executes after

// Asynchronous - NON-BLOCKING
fs.readFile('file.txt', (err, data) => {
    console.log(data);  // runs when file ready
});
console.log('Done');  // executes immediately

================================================================================
3. EVENT LOOP
================================================================================

PHASES (in order):
1. Timers      → setTimeout, setInterval
2. I/O Callbacks → system operations
3. Idle/Prepare → internal
4. Poll        → I/O events, executes callbacks
5. Check       → setImmediate
6. Close       → close events

SIMPLE RULE:
- Synchronous code runs first
- Then async callbacks execute in event loop phases
- process.nextTick() runs before event loop continues

VISUAL FLOW:

Call Stack          Event Loop           Callback Queue
    │                   │                       │
    │  console.log()    │   ←── Timer/I/O       │
    │  sync code        │       callbacks       │
    │       ↓           │           ↓           │
    └───────────────────┴───────────────────────┘

================================================================================
4. CORE MODULES
================================================================================

Module          Purpose                         Import
─────────────────────────────────────────────────────────
fs              File operations         const fs = require('fs');
http            Create servers          const http = require('http');
path            File paths              const path = require('path');
os              System info             const os = require('os');
events          EventEmitter            const EventEmitter = require('events');
url             URL parsing             const url = require('url');
querystring     Query strings           const qs = require('querystring');
crypto          Encryption/hashing      const crypto = require('crypto');

================================================================================
5. FILE SYSTEM (fs) - QUICK REFERENCE
================================================================================

READ FILE:
  // Sync (blocks)
  const data = fs.readFileSync('file.txt', 'utf-8');
  
  // Async (callback)
  fs.readFile('file.txt', 'utf-8', (err, data) => {
      if (err) throw err;
      console.log(data);
  });
  
  // Promise (async/await)
  const fsPromises = require('fs').promises;
  const data = await fsPromises.readFile('file.txt', 'utf-8');

WRITE FILE:
  fs.writeFileSync('file.txt', 'Hello');  // sync
  fs.writeFile('file.txt', 'Hello', callback);  // async
  await fsPromises.writeFile('file.txt', 'Hello');  // promise

APPEND FILE:
  fs.appendFileSync('file.txt', 'More text');

DELETE FILE:
  fs.unlinkSync('file.txt');

CREATE DIRECTORY:
  fs.mkdirSync('folder');

CHECK IF EXISTS:
  fs.existsSync('file.txt');  // returns true/false

================================================================================
6. HTTP MODULE - SERVER CREATION
================================================================================

BASIC SERVER:

const http = require('http');

const server = http.createServer((req, res) => {
    // req = request object (url, method, headers)
    // res = response object (send data back)
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

REQUEST OBJECT (req):
  req.url         → '/users' or '/about'
  req.method      → 'GET', 'POST', 'PUT', 'DELETE'
  req.headers     → { 'content-type': 'application/json' }

RESPONSE OBJECT (res):
  res.writeHead(statusCode, headers)  → Set status & headers
  res.write(data)                      → Write data to response
  res.end(data)                        → End response (send data)

ROUTING (manual):

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.end('Home');
    } else if (req.url === '/users' && req.method === 'GET') {
        res.end('Users list');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

================================================================================
7. PATH MODULE
================================================================================

const path = require('path');

path.join(__dirname, 'folder', 'file.txt');    
  // → Combines paths with correct separator
  
path.resolve('file.txt');
  // → Returns absolute path
  
path.parse('/home/user/file.txt');
  // → { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }
  
path.basename('/home/user/file.txt');   // → 'file.txt'
path.dirname('/home/user/file.txt');    // → '/home/user'
path.extname('/home/user/file.txt');    // → '.txt'

================================================================================
8. PROCESS & ENVIRONMENT
================================================================================

ENVIRONMENT VARIABLES:
  process.env.PORT        → Access PORT env variable
  process.env.NODE_ENV    → 'development' or 'production'

COMMAND LINE ARGUMENTS:
  process.argv            → Array of command line args
  // node script.js arg1 arg2
  // process.argv = ['node', 'script.js', 'arg1', 'arg2']

CURRENT DIRECTORY:
  __dirname               → Directory of current file
  __filename              → Full path of current file
  process.cwd()           → Current working directory

EXIT PROCESS:
  process.exit(1)         → Exit with error code
  process.exit(0)         → Exit successfully

================================================================================
9. NPM COMMANDS - QUICK REFERENCE
================================================================================

Initialize project:
  npm init -y

Install packages:
  npm install express          # Install express
  npm install -g nodemon       # Install globally
  npm install --save-dev jest  # Dev dependency

Common flags:
  -g      → Global installation
  --save  → Add to dependencies (default)
  -D      → Dev dependency (--save-dev)
  --force → Force reinstall

Scripts (in package.json):
  "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "test": "jest"
  }

Run scripts:
  npm start        # Runs "start" script
  npm run dev      # Runs "dev" script
  npm test         # Runs "test" script

================================================================================
10. COMMON PATTERNS
================================================================================

MODULE EXPORTS:
  // math.js
  const add = (a, b) => a + b;
  const sub = (a, b) => a - b;
  module.exports = { add, sub };
  
  // app.js
  const { add, sub } = require('./math');

ERROR HANDLING (async):
  try {
      const data = await someAsyncOperation();
  } catch (error) {
      console.error('Error:', error.message);
  }

ERROR HANDLING (callback):
  fs.readFile('file.txt', (err, data) => {
      if (err) {
          console.error('Read failed:', err);
          return;
      }
      console.log(data);
  });

================================================================================
REVISION CHECKLIST
================================================================================

□ Node.js runs on V8 engine
□ Non-blocking I/O means async operations
□ Event loop handles async callbacks
□ Core modules: fs, http, path, os, events
□ Sync vs Async file operations
□ HTTP server: createServer → listen
□ req (request) has url, method, headers
□ res (response) has writeHead, write, end
□ __dirname = current file's directory
□ process.env for environment variables
□ npm init -y creates package.json
□ module.exports to share code

================================================================================
*/

// PRACTICE AREA - Try your code below:

const fs = require('fs');
const http = require('http');
const path = require('path');

console.log('=== NODE.JS NOTES FILE ===');
console.log('This file contains inline notes for Node.js concepts');
console.log('Read the comments above for revision');
console.log('');
console.log('__dirname:', __dirname);
console.log('Current file:', __filename);
