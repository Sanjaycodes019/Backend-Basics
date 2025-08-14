const express = require('express')
const app = express()

const productRoute = require('./routes/products')

app.use(express.json())

app.use("/api/products", productRoute);

app.listen(3000, () => {
    console.log(`server running at the port 3000`)
});

