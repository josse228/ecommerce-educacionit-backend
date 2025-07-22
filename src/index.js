require("dotenv").config();
// Libreria mongoose para conectar a MongoDB
const mongoose = require("mongoose");
const app = require("./app");

console.log("iniciando servidor");

mongoose
    .connect(process.env.MONGO_URI)
        .then(() =>{
            console.log("Conexion exitosa a la base de datos")
            app.listen(process.env.PORT, () => {
                console.log("Servidor corriendo el http://localhost:3000")
            })
        })
        .catch( error => {
            console.log(error)
            console.error("Error al conectar a la base de datos")
        })



