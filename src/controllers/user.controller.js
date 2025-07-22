const User = require("../models/user.model");
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET_TOKEN


async function getUser( req, res ){

    try{

        const users = await User.find().select("-password");

        if(users.length === 0){
            return res.status(404).send({ message: "No se encontraron usuarios"})
        }
        return res.status(200).send({
            message: "Usuarios obtenidos correctamente",
            users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send("No se encontro al usuario");
    }
}


async function getUserById( req, res){

    try{
        const id = req.params.id;

        const user = await User.findById(id).select({ password:0, __v: 0 });
                                // .select("-password")
                                // .select({ name: 1, email:1})

        if(!user){
            return res.status(404).send("Producto no encontrado")
        }

        return res.status(200).send({
            message: "Usuario encontrado correctamente",
            user
        })

    } catch (error){
        console.log(error)
        return res.status(500).send("Usuario no existente")
    }

}


async function createUser( req, res ){
    // recibo el request de quien hace el llamado al metodo POST
    try{
        const user = new User(req.body);

        if(user.password){
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            user.password = hashedPassword;
        }

        const userSaved = await user.save(); //guardamos el usuario en la base de datos
        return res.status(200).send({
            message: "Usuario creado correctamente",
            user: userSaved
        })
    } catch(err) {
        console.log(err);

        if( err instanceof mongoose.Error.ValidationError){
            return res.status(400).send("Error de validacion");
        }
        return res.status(500).send("El usuario no se pudo crear")
    }

}


async function updateUser( req, res ){
    
    try{

        const id = req.params.id;

        if(req.user.rol !== "admin" && req.user._id !== id){
            return res.status(403).send({ message: "No tienes permiso para actualizar este usuario"})
        }

        // Usuario a enviar a la DB
        const userToUpdate = req.body;

        // Usuario a devolver al front sin la password
        const sendUser = req.body
        sendUser.password = undefined;

        const userExist = await User.findById(id);

        if(!userExist){
            return res.status(404).send("No se encontro el usuario");
        }

        await User.findByIdAndUpdate(id, userToUpdate, { new: true });
        return res.status(200).send({
            message: "El usuario se actualizo correctamente",
            user: sendUser
        })


    }catch(err){
        console.log(err);
        return res.status(500).send("Error al actualizar el usuario")
    }

}


async function deleteUserById ( req, res ){

    try{

        const id = req.params.id;

        const userToDelete = await User.findByIdAndDelete(id);

        if(!userToDelete){
            return res.status(404).send({ message: "Usuario no encontrado"})
        }

        return res.status(200).send({
            message: "Usuario eliminado correctamente"
        })

    }catch( error ){
        console.log(error);
        return res.status(500).send( { message: "Error al eliminar usuario" })
    }
}


async function loginUser( req, res ){

    console.log("Invocando Controller de login")

    try{

        const { email, password } = req.body
        console.log(email, password)

        if( !email || !password ){
            return res.status(400).send("Solicitud invalida")
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if(!user){
            return res.status(400).send("Usuario o contraseña incorrecto");
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if(!isValidPassword){
            return res.status(401).send("Usuario o contraseña incorrecto");
        }

        user.password = undefined;

        //Generacion de token al usuario
        const token = jwt.sign(user.toJSON(), secret, { expiresIn: "4h"})

        const userToSend = {
            id: user.id,
            email: user.email,
            rol: user.rol
        }

        return res.status(200).send({
            message: "Inicio de sesion exitoso",
            user: userToSend,
            token
        })


    }catch(err){
        console.log(err);
        return res.status(500).send("Hubo un error interno en el servidor")
    }
}

module.exports = {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    loginUser
}