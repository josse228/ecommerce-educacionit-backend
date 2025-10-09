const { Preference } = require('mercadopago');
const { client } = require('../config/mercadopagoConfig')


async function createPreference(data){

    const preference = new Preference(client)
    console.log('estamos creando la preferencia linea 7:', preference)


    console.log('estamos revisando la data linea 11:', data)
    // Creo la preferencia de MP usando la data que me llega en "data"
    const dataPreference = {
        items: data.map( i => ({
            title: i.name,
            quantity: i.quantity,
            currency_id: 'ARS',
            unit_price: i.price
        })),
        back_urls: {
            success: "https://ecommerce-educacionit.onrender.com/confirmationPurchase",
            failure: "https://ecommerce-educacionit.onrender.com/checkout",
            pending: "https://ecommerce-educacionit.onrender.com"
            },
        auto_return: 'approved',
        notification_url: "https://ecommerce-educacionit-backend.onrender.com/webhookmp",
        payment_methods: {
            excluded_payment_types: [
                { id: "ticket" },
                { id: "bank_transfer"}
            ],
            installments: 1,
        },
    };

    console.log('estamos revisando la generacion de la nueva preferencia 28:', dataPreference)
    const res = await preference.create({ body: dataPreference })
    console.log("ESTE ES EL RESSPONSE.BODY", res)

    return res;

}

module.exports =  createPreference 