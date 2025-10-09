require("dotenv").config();
const createPreference = require('../services/mercadoPagoservice')
const { sendConfirmationPurchase } = require("../services/mailingServices")
const { client } = require('../config/mercadopagoConfig')
const crypto = require('crypto')
const axios = require('axios')
const Order = require("../models/order.model");

async function handlePaymentMercadoPago( req, res ){

    try{

        const { items } = req.body

        const preference = await createPreference(items);

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

        //Recibo el HOOK de MP
        const dataBody = req.body;
        const dataHeader = req.headers;


        //Saco la clave secreta y el requestId de la notificacion del webhook
        const secretDataHeader = dataHeader['x-signature'];
        const requestIdDataHeader = dataHeader['x-request-id'];


        //Obteniendo los QueryParams de la URL
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const idFromUrl = urlParams.get('data.id') || urlParams.get('id');
        const idFromBody = req.body?.data?.id || req.body?.id;

        const dataID = idFromBody || idFromUrl;


        // Separo los valores de la propiedad 'x-signature' con split
        const parts = secretDataHeader.split(",");

        //Inicializo los valores de las variables que tengo en const = parts
        let ts;
        let hash;

        parts.forEach( part => {

            const [ key, value ] = part.split('=');
            if ( key && value ) {
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                if (trimmedKey === 'ts') {
                    ts = trimmedValue;
                } else if ( trimmedKey === 'v1'){
                    hash = trimmedValue
                }
            }
        })
        console.log("TS Y HASCH", ts, hash)

        // Clave secreta de usuario/aplicacion de mercado pago developers
        const secret = process.env.MP_SECRET_KEY

        //Generar el manifest (uso el template proporciano por MP)
        const manifest = `id:${dataID};request-id:${requestIdDataHeader};ts:${ts};`
        console.log("MANIFEST", manifest)

        // Calcular un HMAC en hexadecimal utilizando la clave secreta
        const hmac = crypto
            .createHmac('sha256', secret)
            .update(manifest)
            .digest('hex')

        console.log("HMAC y HASH" , hmac, hash)
        if ( hmac !== hash ) {
            //HMAC varificacion
            console.log('Varificacion HMAC fallida');
            return res.status(200).send({ message: "Firma invalida"});
        } 

        // ✅ RESPONDER PRIMERO
        res.status(200).send({ message: 'Notificación recibida' });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // 🔄 PROCESAR EN SEGUNDO PLANO
        setImmediate( () => {
            handleMercadoPagoNotification(dataBody)
        });

        return

    } catch( err ){
        console.log(err);
        return res.status(500).send({
            message: 'Hubo un error enviando el mail'
        })
    }
}


async function handleMercadoPagoNotification(body){

    const id = body.data.id

    if(!id) return;

    await new Promise(resolve => setTimeout(resolve, 5000))

    try {
        //Solicito a MP el estado del pago a traves de su ID
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        });

        //Repsuesta de MP
        const paymentInfo = response.data

        console.log("ESTE ES EL COLLECTOR", paymentInfo)

        //Consulto el estado del pago
            if (
                body.type === 'payment' &&
                paymentInfo &&
                paymentInfo.status === 'approved'
            ) {
                // Saco el collector de la respuesta de MP para comparar con el collector que se guardo al hacer la preferencia
                const collectormp = paymentInfo.collector_id;

                console.log("ESTE ES EL COLLECTOR", collectormp)

                // Busco la orden guardada usando el collector y luego actualizo el estado de la orden a "completed"
                const updatedOrder = await Order.findOneAndUpdate(
                { collector_id: collectormp },
                {
                    mercadoPagoPaymentId: paymentInfo.id,
                    status: 'completed'
                },
                { new: true }
                );

                //Verifico si no esta creada la orden en la bd
                if (!updatedOrder) {
                    console.log('No se encontró la orden para el preference_id:', collectormp);
                    return;
                }

                console.log("ORDEN", updatedOrder)
                const email = updatedOrder.email;
                const order = updatedOrder.products

                console.log("EMAIL Y ORDER", email, order)
            await sendConfirmationPurchase(email, order);
            console.log('Email de confirmación enviado');
            
        } else {
            console.log('Pago no aprobado o tipo incorrecto');
        }

        return

    } catch (err) {
        console.error('Error al consultar el pago:', err);
    }

}


module.exports = { handlePaymentMercadoPago, handleSendConfirmationPurchase }