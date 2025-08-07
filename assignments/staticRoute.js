const express = require('express');
const app = express();

// Static products data (can also be in a separate JSON file)
const products = [
  { id: 1, name: "iPhone", category: "mobile" },
  { id: 2, name: "Samsung TV", category: "electronics" },
  { id: 3, name: "Redmi", category: "mobile" },
  { id: 4, name: "Washing Machine", category: "appliances" }
];

// Route with query handling
app.get('/product', (req, res) => {
  const categoryQuery = req.query.category;

  if (categoryQuery) {
    // Filter based on category query
    const filtered = products.filter(product => product.category === categoryQuery);
    res.json(filtered);
  } else {
    // If no query, return all products
    res.json(products);
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
