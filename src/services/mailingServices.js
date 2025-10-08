const nodemailer = require('nodemailer');

// Creamos el transporter del Servicio de Mail

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})

async function sendConfirmationPurchase(to, content){

    console.log("ME ESTAN INVOCANDO AL SERVICIO MAILING", to, content)

    let message = {
        from: process.env.GMAIL_USER,
        to,
        subject: "Confirmacion de Compra",
        text: "Confirmacion de compra",
        html: `
        <p>Hola ${to}. Gracias por tu compra.</p>
        <ul>
            ${content.map(item => `<li>${item.name} - ${item.quantity}</li>`).join('')}
        </ul>
        `
    }

    console.log(message)

    try {
    
        return transporter.sendMail(message);
    } catch (err) {
        console.error("Error al enviar el mail:", err);
    }
}

module.exports = { sendConfirmationPurchase }