const express = require('express')
const router = express.Router()

const  { 
    getOrders,
    getOrder,
    createOrder,
    deleteOrder 
} = require('../controllers/orders.js')

router.get('/', getOrders)

router.get('/:orderID', getOrder)

router.post('/', createOrder) 

router.delete('/:orderID', deleteOrder)

module.exports = router