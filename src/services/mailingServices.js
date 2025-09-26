const nodemailer = require('nodemailer');

// Creamos el transporter del Servicio de Mail

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})

function sendConfirmationPurchase(to, name, content){
    let message = {
        from: proccess.env.GMAIL_USER,
        to,
        subject: "Confirmacion de Compra",
        text: "Confirmacion de compra",
        html: `${name} y ${content}`
    }
    return transporter.sendMail(message)
}

module.exports = { sendConfirmationPurchase }