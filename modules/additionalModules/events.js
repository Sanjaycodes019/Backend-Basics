// creating own event emitter system

const eventEmitter = require('events');
const emitter = new eventEmitter();

emitter.on('login', ()=>{
    console.log('user has logged in!');
});
emitter.emit('login');