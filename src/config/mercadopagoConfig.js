require("dotenv").config();
const mercadopago = require('mercadopago');
const { MercadoPagoConfig } = mercadopago;

// Agrego credenciales
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-5356761366284467-091019-1a6a900d02bdb246f44860bf902a1203-1842451478'
})

module.exports = {
    mercadopago,
    client
}