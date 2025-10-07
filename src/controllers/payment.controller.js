require("dotenv").config();
const createPreference = require('../services/mercadoPagoservice')
const { sendConfirmationPurchase } = require("../services/mailingServices")
const { mercadopago } = require('../config/mercadopagoConfig')
const crypto = require('crypto')

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
        const dataID = urlParams.get('data.id');

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
        const manifest = `id:${dataID};request-id:${requestIdDataHeader};ts:${ts}`
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
            return res.status(500).send({ message: "Firma invalida"});
        } 

        const paymentInfo = await mercadopago.payment.findById(dataID);
        if ( paymentInfo && 
            dataBody.type === 'payment' &&
            paymentInfo.body.status === 'approved') {
                console.log("ESTOY APROBANDO LA TRX--------------------------------------------")
                const email = paymentInfo.body.payer?.email;
                const items = paymentInfo.body.additional_info?.items;

                await sendConfirmationPurchase(email, items);
        }

        return res.status(200).send({
            message: "El pago se realizo exitosamente"
        })

    } catch( err ){
        console.log(err);
        return res.status(500).send({
            message: 'Hubo un error enviando el mail'
        })
    }
}

module.exports = { handlePaymentMercadoPago, handleSendConfirmationPurchase }