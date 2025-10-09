const Order = require("../models/order.model");
const moongose = require("mongoose");

async function handleConfirmationPurchase( req, res ){

    try{

        const order = req.body;

        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const collector = urlParams.get('collection_id');

        console.log("COLLECTOR", collector)
        console.log("ORDEN EN EL REQUEST", order)

        return res.status(200).send({
            message: 'Respuesta de MP'
        })


    }catch(err){
        console.log(err);
        return res.status(500).send({ message: "Hubo un error interno en el servidor "})
    }
}

module.exports = {
    handleConfirmationPurchase
}