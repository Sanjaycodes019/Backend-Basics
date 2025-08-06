const express = require('express');
const path = require('path');
const app = express();

// middleware to parse form data
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'form.html'));
});

//handling form submission
app.post('/submit', (req, res)=>{
    const {name, email} = req.body;
    res.send(`Email is ${email}, and the name is ${name}`);
})

app.listen(3000, ()=>{
    console.log('server running at the port 3000')
});



// <!DOCTYPE html>
// <html>
// <head>
//     <title>Form Example</title>
// </head>
// <body>
//     <h2>Submit Your Info</h2>
//     <form action="/submit" method="POST">
//         <input type="text" name="name" placeholder="Enter your name" required><br><br>
//         <input type="email" name="email" placeholder="Enter your email" required><br><br>
//         <button type="submit">Submit</button>
//     </form>
// </body>
// </html>
