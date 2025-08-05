// working with query parameters
const http = require('http')
const fs = require('fs')
const url = require('url');


// return name with greeting 
// http.createServer((req, res)=>{
//     const q = url.parse(req.url, true).query;
//     res.end(`Hello ${q.name || 'Guest'}`);
// }).listen(3000);


// add two numbers passed in query

// http.createServer((req, res)=>{
//     const q = url.parse(req.url, true).query;
//     const sum = Number(q.a)+Number(q.b);
//     // Number() converts query strings into numbers..
//     res.end(`the sum is ${sum}`);
// }).listen(3000)


// return current year if query has key year = true
// http.createServer((req, res)=>{
//     const q = url.parse(req.url, true).query;
//     res.end(q.year==='true'?`year: ${new Date().getFullYear()}`:'No Year');
// }).listen(3000)


// check if a number is even or odd using query
// http.createServer((req, res)=>{
//     const q = url.parse(req.url, true).query;
//     const n = Number(q.num);
//     res.end(n%2===0?'Even':'Odd');
// }).listen(3000);


// greet user with different languages
// http.createServer((req, res)=>{
//     const q = url.parse(req.url, true).query;
//     const greetings = {en:'Hello', hi:'Namaste', fr:'Bonjour'};
//     res.end(greetings[q.lang]||'Hello');
// }).listen(3000);

// display multiplication number
// http.createServer((req, res)=>{
//     const q = url.parse(req.url, true).query;
//     const n = Number(q.num);
//     let result = '';
//     for(let i = 1; i <= 10; i++) result += `${n} * ${i} = ${n*i}\n`;
//     res.end(result);
// }).listen(3000);


const products = {1:'laptop', 2:'phone', 3:'tablet'};
http.createServer((req, res)=>{
    const {id} = url.parse(req.url, true).query;
    res.end(products[id]||'Product not found');
}).listen(3000);