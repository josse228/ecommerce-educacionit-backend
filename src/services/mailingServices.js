const sgMail = require('@sendgrid/mail');

// Configurá tu API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationPurchase(to, content) {
    console.log("ME ESTAN INVOCANDO AL SERVICIO MAILING", to, content);

    const message = {
        to,
        from: 'electromailingservice@gmail.com', 
        subject: 'Confirmación de Compra',
        html: `
        <div style="background-color: rgb(37, 96, 235); padding: 40px 20px; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">
            <h2 style="color: rgb(252, 139, 2); margin-bottom: 20px;">¡Gracias por tu compra!</h2>
            <p style="color: #000000; font-size: 16px;">Hola <strong>${to}</strong>,</p>
            <p style="color: #000000; font-size: 16px;">Tu pedido ha sido recibido correctamente. A continuación te detallamos los productos adquiridos:</p>
            <ul style="color: #000000; font-size: 16px; padding-left: 20px;">
                ${content.map(item => `<li><strong>${item.name}</strong> - Cantidad: ${item.quantity}</li>`).join('')}
            </ul>
            <p style="color: #000000; font-size: 16px;">Nos alegra tenerte como cliente. Si tenés alguna consulta, no dudes en responder este correo.</p>
            <div style="margin-top: 30px; text-align: center;">
                <a href="#" style="background-color: rgb(252, 139, 2); color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver mi pedido</a>
            </div>
            <div style="margin-top: 40px; font-size: 14px; color: #999999; text-align: center;">
                ElectroMailingService © 2025
            </div>
            </div>
        </div>
        `
    };

    try {
        await sgMail.send(message);
        console.log('Correo enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo:', error.response?.body || error);
    }
}

module.exports = { sendConfirmationPurchase };