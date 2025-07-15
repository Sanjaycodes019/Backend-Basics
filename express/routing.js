// routing
// applications endpoints(urls) respond to client request

// syntax
// app.method(path, handler)
// method = http method, get, post, put, delete
// path = /, /about, /user/:id
// handler = function with (req, res)

// common HTTP methods in Express
// GET -> fetch data
// POST -> submit data(eg forms)
// PUT -> update data
// DELETE -> remove data

// example code with multiple routes

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send('this is Home Page');
});

app.get('/about', (req, res)=>{
    res.send('this is About Page');
})

app.get('/contact', (req, res)=>{
      res.send(`
    <form method="POST" action="/contact">
      <input name="name" placeholder="Enter name"/>
      <button type="submit">Send</button>
    </form>
  `);
});

// handle post from /contact
app.post('/contact', (req, res)=>{
    const name = req.body.name;
    res.send(`thanku ${name}, we recieved your message`);
});

app.use((req, res)=>{
    res.status(404).send('404 - page not found');
})

app.listen(3000, ()=>{
    console.log('server started');
});

