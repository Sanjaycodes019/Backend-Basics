const express = require('express')
const router = express.Router()

const products = [
    {id: 1, category: 'electronics', name:'smartphone', price: 699},
    {id: 2, category: 'electronics', name:'laptop', price: 1200},
    {id: 3, category: 'clothing', name:'t-shirt', price: 30},
    {id: 4, category: 'clothing', name:'jeans', price: 30},
    {id: 5, category: 'clothing', name:'jacket', price: 50},
]

// get /products - return product list
router.get('/', (req, res)=>{
    res.json(products);
})

// get /products/:categories/:id - return specific product
router.get("/:category/:id", (req, res)=>{
    const{category, id} = req.params;
    const product = products.find(
        p => p.category === category && p.id === parseInt(id)
    );

    if(product){
        res.json(product);
    } else {
        res.status(404).json({message:"product not found"})
    }
});

module.exports = router;