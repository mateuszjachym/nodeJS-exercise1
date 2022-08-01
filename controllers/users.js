const data = require('../data.json');
const fs = require('fs');

const getUsers = ((req, res) => {
    res.json(data.users);
})

const getUser = ((req, res) => {
    const id = Number(req.params.userID);
    const user = data.users.find(user => user.id === id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
})

const createUser = ((req, res) => {
    let identity = 0;
    if(!data.users.length) identity = 1;
    else identity = data.users[data.users.length - 1].id + 1;
    const newUser = {
        id: identity,
        name: req.body.name,
        money: req.body.money
    }
    data.users.push(newUser);
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(201).json(newUser);
})

const updateUser = ((req, res) => {
    const id = Number(req.params.userID);
    const index = data.users.findIndex(user => user.id === id);
    if (index === -1) return res.status(404).send('User not found');
    const updatedUser = {
        id: data.users[index].id,
        name: req.body.name,
        money: req.body.money
    }
    data.users[index] = updatedUser;
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(201).json('User updated');
})

const deleteUser = ((req, res) => {
    const id = Number(req.params.userID);
    const index = data.users.findIndex(user => user.id === id);
    if (index === -1) return res.status(404).send('User not found');
    for(let i = data.orders.length - 1; i >= 0; --i){
        if(data.orders[i].userID === id) {
            const productIndex = data.products.findIndex(product => product.id === data.orders[i].productID);
            data.products[productIndex].amount += 1;
            data.orders.splice(i,1);
        }
    }
    data.users.splice(index,1);
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json('User deleted');
}) 

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}