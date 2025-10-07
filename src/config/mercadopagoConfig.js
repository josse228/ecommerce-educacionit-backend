require("dotenv").config();
const mercadopago = require('mercadopago');
const { MercadoPagoConfig } = mercadopago;

// Agrego credenciales
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
})

module.exports = {
    mercadopago,
    client
}