const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs")


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        console.log("El controller upload se ejecutó", req)
        let dir = '';


        if(req.path.includes('/products')){
            dir = path.join(__dirname, '..', 'uploads', 'products');
            

        } else if(req.path.includes('/users')){
            dir = path.join(__dirname, '..', 'uploads', 'users');
        }
        

        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true})
        }

        cb(null, dir);
    },

    filename: ( req, file, cb ) => {

        if (!file.mimetype.startsWith("image/")){
            return cb(new Error("Solo se permiten archivos de imagenes"), false)
        }

        const uniqueSuffix = crypto.randomBytes(16).toString("hex");
        const ext = path.extname(file.originalname);

        const filename = `${uniqueSuffix}${ext}`

        cb(null, filename)
    }

})

const upload = multer({ storage }).single('image');

module.exports = upload;