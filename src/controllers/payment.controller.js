const createPreference = require('../services/mercadoPagoservice')

async function handlePaymentMercadoPago( req, res ){

    try{

        console.log('ESTO ES EL REQUEST DESDE EL FRONT', req)
        const preference = await createPreference(req.body);
        console.log('Este es el controllador de payments linea:8', preference)

        res.status(200).send({
            preference,
            id: preference.id,
            init_point: preference.init_point,
            status: "Preference created succesfully"
        })
    } catch( err ){
        console.log(err);
        return res.status(500).send({
            message: 'Hubo un error interno en el servidor.'
        })
    }

}

async function handleSendConfirmationPurchase( req, res ){
    
    try {

        return res.status(200).send({
            message: "Hubo un enviuo ed mail"
        })

    } catch( err ){
        console.log(err);
        return res.status(500).send({
            message: 'Hubo un error enviando el mail'
        })
    }
}

module.exports = { handlePaymentMercadoPago }