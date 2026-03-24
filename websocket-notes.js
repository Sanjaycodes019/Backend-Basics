/*
================================================================================
                    WEBSOCKETS - SOCKET.IO NOTES
================================================================================

TABLE OF CONTENTS:
1. What are WebSockets?
2. Socket.IO Setup
3. Event Handling
4. Rooms
5. Namespaces
6. Broadcasting
7. Authentication
8. Complete Chat Example

================================================================================
1. WHAT ARE WEBSOCKETS?
================================================================================

HTTP vs WebSockets:
  HTTP:  Request → Response (one way)
  WS:    Persistent connection (bi-directional)

USE CASES:
- Real-time chat
- Live notifications
- Collaborative editing
- Stock tickers
- Multiplayer games

INSTALL:
  npm install socket.io

================================================================================
2. SOCKET.IO SETUP
================================================================================

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }  // Configure for production
});

// Connection event
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(3000);

================================================================================
3. EVENT HANDLING
================================================================================

// Server sending to client
socket.emit('message', 'Hello client!');

// Server broadcasting to all clients
io.emit('notification', 'News for everyone');

// Listening to client events
socket.on('chat message', (msg) => {
    console.log('Message:', msg);
    // Broadcast to all except sender
    socket.broadcast.emit('chat message', msg);
});

// With acknowledgment
socket.on('chat message', (msg, callback) => {
    console.log('Message:', msg);
    callback({ status: 'received' });  // Send acknowledgment
});

// Client-side (browser)
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.emit('chat message', 'Hello!');

socket.on('chat message', (msg) => {
    console.log('New message:', msg);
});

================================================================================
4. ROOMS
================================================================================

// Join room
socket.join('room-1');

// Leave room
socket.leave('room-1');

// Send to room (except sender)
socket.to('room-1').emit('message', 'Hello room!');

// Send to room (including sender)
io.to('room-1').emit('message', 'Hello everyone in room!');

// Send to multiple rooms
io.to('room-1').to('room-2').emit('message', 'Hello rooms!');

// Get rooms for socket
const rooms = socket.rooms;  // Set of room names

// Get all sockets in room
const sockets = await io.in('room-1').fetchSockets();

================================================================================
5. NAMESPACES
================================================================================

// Default namespace /
// Custom namespace /chat
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
    console.log('User joined chat namespace');
    
    socket.on('message', (msg) => {
        chatNamespace.emit('message', msg);
    });
});

// Client connects to namespace
const socket = io('http://localhost:3000/chat');

================================================================================
6. MIDDLEWARE
================================================================================

// Authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (verifyToken(token)) {
        socket.userId = getUserIdFromToken(token);
        next();
    } else {
        next(new Error('Authentication error'));
    }
});

================================================================================
7. COMPLETE CHAT EXAMPLE
================================================================================
*/

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }
});

// Store messages (in production use Redis/DB)
const messages = [];
const users = new Map();  // socket.id -> username

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Join chat
    socket.on('join', (username) => {
        users.set(socket.id, username);
        socket.broadcast.emit('user joined', {
            username,
            message: `${username} joined the chat`
        });
        
        // Send chat history to new user
        socket.emit('history', messages);
    });
    
    // Handle message
    socket.on('chat message', (data) => {
        const username = users.get(socket.id);
        const message = {
            id: Date.now(),
            username,
            text: data.text,
            timestamp: new Date().toISOString()
        };
        
        // Store message
        messages.push(message);
        if (messages.length > 100) messages.shift();  // Keep last 100
        
        // Broadcast to all
        io.emit('chat message', message);
    });
    
    // Typing indicator
    socket.on('typing', (isTyping) => {
        const username = users.get(socket.id);
        socket.broadcast.emit('typing', { username, isTyping });
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        users.delete(socket.id);
        
        if (username) {
            socket.broadcast.emit('user left', {
                username,
                message: `${username} left the chat`
            });
        }
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Serve static HTML for testing
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Chat</title></head>
    <body>
        <h1>Socket.IO Chat</h1>
        <input id="username" placeholder="Your name" />
        <button onclick="join()">Join</button>
        <div id="chat"></div>
        <input id="msg" placeholder="Message" />
        <button onclick="send()">Send</button>
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();
            let username = '';
            
            function join() {
                username = document.getElementById('username').value;
                socket.emit('join', username);
            }
            
            function send() {
                const text = document.getElementById('msg').value;
                socket.emit('chat message', { text });
            }
            
            socket.on('chat message', (msg) => {
                document.getElementById('chat').innerHTML += 
                    '<p><b>' + msg.username + ':</b> ' + msg.text + '</p>';
            });
        </script>
    </body>
    </html>
    `);
});

console.log('=== WEBSOCKETS NOTES ===');
console.log('Install: npm install socket.io');
console.log('Client library: <script src="/socket.io/socket.io.js"></script>');

module.exports = { httpServer, io };
