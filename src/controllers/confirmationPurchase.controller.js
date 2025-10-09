const Order = require("../models/order.model");
const moongose = require("mongoose");

async function handleConfirmationPurchase( req, res ){

    try{

        const { collection_id } = req.query;


        const order = await Order.findOne({
            mercadoPagoPaymentId: collection_id,
            status: "completed" // o "approved", según cómo lo guardes
        });

        if (!order) {
            return res.status(404).send({ message: "Orden no encontrada o no aprobada" });
        }

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