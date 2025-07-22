function isAdmin( req, res, next){

    const role = req.user.rol
    if( role  !== 'admin'){
        return res.status(403).send({ message: "No eres administrador del sitio"})
    }

    next();
}

module.exports = isAdmin