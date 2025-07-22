const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { formatDateToUTC} = require("../utils/dateFormatter");
const path = require('path');
const fs = require("fs");


async function getProducts( req, res ){
    
    try{

        const products = await Product.find();

        return res.status(200).send({
            message: "Productos encontrados",
            products
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("Error interno del servidor")
    }
}

async function getProductById( req, res ){

    try{

        const id = req.params.id;

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).send({
                message: "No existe ese producto"
            })
        }

        return res.status(200).send({
            message: "Producto encontrado",
            product
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("Hubo un error interno en el servidor")
    }
}

async function createProduct( req, res ){

    try{

        const formattedDate = formatDateToUTC(req.body.created);

        const product = await new Product({
            ...req.body,
            created: formattedDate
        });

        if(req.file){
            console.log("Req IMG multer", req.file)
            product.image = req.file.filename
        } else{
            return res.status(400).send({
                message: "Debe enviar una imagen del producto"
            })
        }

        const productSaved = await product.save();

        return res.status(200).send({
            message: "Producto creado correctamente",
            product: productSaved
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("Hubo un problema interno en el servidor")
    }
}

async function updateProduct ( req, res ){

    try{

        console.log("req", req.params)
        const id = req.params.id;
        const productToUpdate = req.body

        console.log("id", id)
        console.log("id", productToUpdate)

        const productExists = await Product.findById(id);
        if(!productExists){
            return res.status(404).send("Este producto no existe.")
        }

        console.log("nombre de la img", productExists.image)

        if (req.file && productExists.image){ 
            console.log("ESTA IMAGEN ES LA DEL PRODUCTO", productExists.image) 
            const oldImagePath = path.join(__dirname, '..', 'uploads', 'products', productExists.image); 
            console.log("PATH", oldImagePath) 
            if (fs.existsSync(oldImagePath)) { 
                fs.unlinkSync(oldImagePath); //Elimina el archivo 
            } 
        }

        if(req.file){
            console.log("Req IMG multer", req.file)
            productToUpdate.image = req.file.filename
        } else{
            return res.status(400).send({
                message: "Debe enviar una imagen del producto"
            })
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, productToUpdate, { new: true });

        return res.status(200).send({
            message: "Producto actualizado correctamente",
            product: updatedProduct
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("Hubo un error interno en el servidor")
    }
}

async function deleteProduct ( req, res ){

    try{

        const id = req.params.id;
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).send("Producto no encontrado.")
        }

        if (product.image){ 
        console.log("SE ESTA INTENTANDO ELILMINAR LA IMAGEN", product.image) 
        const imagePath = path.join(__dirname, '..', 'uploads', 'products', product.image); 
        console.log("PATH", imagePath) 
            if (fs.existsSync(imagePath)) { 
                fs.unlinkSync(imagePath); //Elimina el archivo 
            } 
        }

        const deleteProduct = await Product.findByIdAndDelete(id);

        return res.status(200).send({
            message: "Producto eliminado correctamente.",
            product: deleteProduct
        })

    }catch(err){
        console.log(err);
        return res.status(500).send("Hubo un error interno en el servidor.")
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}