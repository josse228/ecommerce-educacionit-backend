// Libreria express para crear el servidor
const express = require("express");
// Inicializamos el servidor express
const app = express();
// Traigo cors
const cors = require("cors");
// Me traigo las rutas de user, product y order
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require('./routes/payment.routes');
const isHealth = require('./routes/health.routes')

// me traigo el modulo de path
const path = require("path");


//para preparar la app para que pueda recibir data en formato json y el uso de cors
app.use(express.json())
app.use(cors())

// Compartir carpeta de archivos staticos
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// hago que mi app use las rutas de mi aplicacion con routes.
app.use([userRoutes, productRoutes, orderRoutes, paymentRoutes, isHealth])


module.exports = app