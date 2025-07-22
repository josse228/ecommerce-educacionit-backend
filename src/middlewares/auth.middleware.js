const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_TOKEN;

function auth( req, res, next ){
    //obtenemos el token desde el header

    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).send({ message: "No autorizado"})
    }

    // validamos el token
    jwt.verify(token, secret, ( error, decoded ) => {

        if(error){
            return res.status(401).send({ message: "Token Inválido"})
        }

        req.user = decoded;

        next();
    })
}

module.exports = auth