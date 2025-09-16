const { Preference } = require('mercadopago');
const { client } = require('../config/mercadopagoConfig')


async function createPreference(data){

    const preference = new Preference(client)
    console.log('estamos creando la preferencia linea 7:', preference)


    console.log('estamos revisando la data linea 11:', data)
    // Creo la preferencia de MP usando la data que me llega en "data"
    const dataPreference = {
        items: [{
            title: data.items[0].title,
            quantity: data.items[0].quantity,
            currency_id: 'ARS',
            unit_price: data.items[0].price
            }],
        back_urls: {
            success: "https://www.tu-sitio/success",
            failure: "https://www.tu-sitio/failure",
            pending: "https://www.tu-sitio/pending"
            },
        auto_return: 'approved'
    };

    console.log('estamos revisando la generacion de la nueva preferencia 28:', dataPreference)
    const res = await preference.create({ body: dataPreference })
    console.log("ESTE ES EL RESSPONSE.BODY", res)

    return res;

}

module.exports =  createPreference 