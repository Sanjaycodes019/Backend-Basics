// used for creating secure passwords, tokens etc

const crypto = require('crypto');

const hash = crypto.createHash('sha256').update('sanjay').digest('hex');
console.log(hash);
