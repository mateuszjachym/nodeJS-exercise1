const data = require('../data.json')
const fs = require('fs')

/*const getOrders = ((req, res) => {
    res.json(data.orders)
})*/
const getOrders = ((req,res) => {
    const updatedOrders = [];
    for(let i = 0; i < data.orders.length; ++i){
        const indexUser = Number(data.users.findIndex(user => user.id === data.orders[i].userID));
        const indexProduct = Number(data.products.findIndex(product => product.id === data.orders[i].productID));
        updatedOrders[i] = {id: data.orders[i].id, userName: data.users[indexUser].name, productName: data.products[indexProduct].name};
    } 
    res.json(updatedOrders);
})

const getOrder = ((req, res) => {
    const id = Number(req.params.orderID);
    const order = data.orders.find(order => order.id === id);
    if (!order) return res.status(404).send('Order not found');
    res.json(order);
})

const createOrder = ((req, res) => {
    let identity = 0;
    if(!data.orders.length) identity = 1;
    else identity = data.orders[data.orders.length - 1].id + 1;
    const newOrder = {
        id: identity,
        productID: req.body.productID,
        userID: req.body.userID
    }
    const indexUser = data.users.findIndex(user => user.id === newOrder.userID);
    const indexProduct = data.products.findIndex(product => product.id === newOrder.productID);

    if(indexUser === -1) return res.status(404).send("Wrong user ID");
    if(indexProduct === -1) return res.status(404).send("Wrong product ID");
    if(data.users[indexUser].money <  data.products[indexProduct].price) return res.status(404).json("Insufficient amount of money");
    if( data.products[indexProduct].amount <= 0 ) return res.status(404).json("Out of stock");

    data.orders.push(newOrder);
    data.users[indexUser].money -= data.products[indexProduct].price;
    data.products[indexProduct].amount -= 1;
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(201).json('Order created');
})


const deleteOrder = ((req, res) => {
    const id = Number(req.params.orderID);
    const index = data.orders.findIndex(order => order.id === id);
    if (index === -1) return res.status(404).send('Order not found');
    const productID = data.orders[index].productID;
    const userID = data.orders[index].userID;

    const indexUser = data.users.findIndex(user => user.id === userID);
    const indexProduct = data.products.findIndex(product => product.id === productID);

    data.users[indexUser].money += data.products[indexProduct].price;
    data.products[indexProduct].amount += 1;
    data.orders.splice(index,1);
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json('Order deleted');
})

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder
}