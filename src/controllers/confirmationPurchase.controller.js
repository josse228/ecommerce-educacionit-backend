const Order = require("../models/order.model");
const moongose = require("mongoose");

async function handleConfirmationPurchase( req, res ){

    try{

        console.log("INVOCANDO LA CONFIRMACION DE COMPRA", req.query)

        /*
            collection_id,
            collection_status,
            payment_id,
            status,
            external_reference,
            payment_type,
            merchant_order_id,
            preference_id,
            site_id,
            processing_mode,
            merchant_account_id
        */

        const { external_reference } = req.query;


        const order = await Order.findOne({
            external_reference: external_reference,
            status: "completed" // o "approved", según cómo lo guardes
        });

        console.log("ORDEN DE LA BASE", order)

        if (!order) {
            return res.status(404).send({ message: "Orden no encontrada o no aprobada" });
        }

        return res.status(200).send({
            order,
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