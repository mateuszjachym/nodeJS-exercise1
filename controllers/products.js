const data = require('../data.json')
const fs = require('fs')

const getProducts = ((req, res) => {
    res.json(data.products)
})

const getProduct = ((req, res) => {
    const id = Number(req.params.productID)
    const product = data.products.find(product => product.id === id)
        if (!product) {
        return res.status(404).send('Product not found')
    }
    res.json(product)
})

const createProduct = ((req, res) => {
    let identity = 0;
    if(!data.products.length) identity = 1;
    else identity = data.products[data.products.length - 1].id + 1;
    const newProduct = {
        id: identity,
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount
    }
    data.products.push(newProduct)
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(201).json(newProduct)
})

const updateProduct = ((req, res) => {
    const id = Number(req.params.productID)
    const index = data.products.findIndex(product => product.id === id)
    const updatedProduct = {
        id: data.products[index].id,
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount
    }
    data.products[index] = updatedProduct
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json('Product updated')
})

const deleteProduct = ((req, res) => {
    const id = Number(req.params.productID)
    const index = data.products.findIndex(product => product.id === id)
        if (index === -1) {
        return res.status(404).send('Product not found')
    }
    for(let i = data.orders.length - 1; i >= 0; --i){
        if(data.orders[i].productID === id) {
            const userIndex = data.users.findIndex(user => user.id === data.orders[i].userID);
            data.users[userIndex].money = data.users[userIndex].money + data.products[index].price;
            data.orders.splice(i,1);
        }
    }
    data.products.splice(index,1)
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json('Product deleted')
})

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}