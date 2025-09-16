const createPreference = require('../services/mercadoPagoservice')

async function handlePaymentMercadoPago( req, res ){

    try{

        console.log(req)
        const preference = await createPreference(req.body);
        console.log('Este es el controllador de payments linea:8', preference)

        res.status(200).send({
            init_point: preference.init_point
        })

    } catch( err ){
        console.log(err);
        return res.status(500).send({
            message: 'Hubo un error interno en el servidor.'
        })
    }

}

module.exports = { handlePaymentMercadoPago }