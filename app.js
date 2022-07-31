const express = require('express')
const app = express()
const products_routes = require('./routers/products.js')
const users_routes = require('./routers/users.js')
const orders_routes = require('./routers/orders.js')
//const data = require('./data.json')

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})

app.use(express.json())
app.use('/api/products', products_routes)
app.use('/api/users', users_routes)
app.use('/api/orders', orders_routes)