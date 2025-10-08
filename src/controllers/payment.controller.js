require("dotenv").config();
const createPreference = require('../services/mercadoPagoservice')
const { sendConfirmationPurchase } = require("../services/mailingServices")
const { client } = require('../config/mercadopagoConfig')
const crypto = require('crypto')
const axios = require('axios')
const Order = require("../models/order.model");

async function handlePaymentMercadoPago( req, res ){

    try{

        console.log('-------------------------------------------ESTO ES EL REQUEST DESDE EL FRONT', req.body)

        const { items } = req.body

        console.log("-------------------------ITEMSSSSS-----", items)

        const preference = await createPreference(items);
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

        console.log("Recibo el WEBHOOK con MP")
        const dataBody = req.body;
        const dataHeader = req.headers;

        console.log("DATA Y HEADER ---------------------", dataBody, dataHeader)

        //Saco la clave secreta y el requestId de la notificacion del webhook
        const secretDataHeader = dataHeader['x-signature'];
        const requestIdDataHeader = dataHeader['x-request-id'];

        console.log("SECRETDATAHEADER", secretDataHeader)
        console.log("requestIDHeader", requestIdDataHeader)

        //Obteniendo los QueryParams de la URL
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const idFromUrl = urlParams.get('data.id') || urlParams.get('id');
        const idFromBody = req.body?.data?.id || req.body?.id;

        const dataID = idFromBody || idFromUrl;

        console.log("URLPARAMS", urlParams)
        console.log("DataID", dataID)

        // Separo los valores de la propiedad 'x-signature' con split
        const parts = secretDataHeader.split(",");
        console.log("PARTS", parts)
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

let orderId;

function getOrderId(id){

    let orderId = id;
    console.log("ORDER ID-------------------------", orderId)
    return orderId
}

console.log("ORDER ID-------------------------", orderId)

async function handleMercadoPagoNotification(body){

    const id = body.data.id

    console.log("ESTE ES EL ID------------", id)

    if(!id) return;

    await new Promise(resolve => setTimeout(resolve, 5000))

    try {
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        });

        console.log("RESSPONNNSEEE", response)
        const paymentInfo = response.data

        console.log("PAYMENT INFO", paymentInfo)

            if (
                body.type === 'payment' &&
                paymentInfo &&
                paymentInfo.status === 'approved'
            ) {

                const getOrder = await Order.findById(orderId);
                console.log("ORDER ID-------------------------", getOrder)
                const email = getOrder.email;
                const items = getOrder.products

            await sendConfirmationPurchase(email, items);
            console.log('Email de confirmación enviado');
            return
        } else {
            console.log('Pago no aprobado o tipo incorrecto');
        }

        return

    } catch (err) {
        console.error('Error al consultar el pago:', err);
    }

}


module.exports = { handlePaymentMercadoPago, handleSendConfirmationPurchase, getOrderId }