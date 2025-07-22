const Order = require("../models/order.model");
const mongoose = require("mongoose");


async function getOrders( req, res ){

    try{

        const orders = await Order.find();

        return res.status(200).send({
            message: "Resultados de las ordenes",
            order: orders
        })

    }catch(err){
        console.log(err);
        return res.status(500).send({
            message: "Hubo un error interno en el servidor"
        })
    }
}

async function createOrder( req, res ){
    
    try{

        const order = new Order(req.body);

        const newOrder = await order.save();

        return res.status(200).send({
            message: "Se creo la orden correctamente",
            order: newOrder
        })

    }catch(err){
        console.log(err);
        return res.status(500).send({ message: "Hubo un error interno en el servidor"})
    }
}

module.exports = {
    getOrders,
    createOrder
}