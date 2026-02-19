require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const db = require('./db/renta_manteleria_cristaleria_db');

const app = express();

//  MIDDLEWARES

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

//  RUTA PRINCIPAL LOGIN

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login.html'));
});

//  REGISTRO CLIENTES

app.post('/registro', async (req,res)=>{

    const {nombre,email,password,telefono} = req.body;

    if(!nombre || !email || !password || !telefono){
        return res.status(400).json({
            mensaje:"Todos los campos son obligatorios"
        });
    }

    try{

        //  verificar si el correo ya existe
        const [existe] = await db.query(
            "SELECT id_usuario FROM usuarios WHERE email=?",
            [email]
        );

        if(existe.length>0){
            return res.status(400).json({
                mensaje:"El correo ya está registrado"
            });
        }

        //  Encriptcion de las contraseñas
        const hash = await bcrypt.hash(password,10);

        const sql = `
        INSERT INTO usuarios
        (id_rol,nombre,email,password,telefono,estado,created_at,imagen)
        VALUES(3,?,?,?,?, 'activo',NOW(),NULL)
        `;

        await db.query(sql,[nombre,email,hash,telefono]);

        res.json({
            mensaje:"Usuario cliente creado correctamente"
        });

    }catch(error){

        console.log("ERROR REGISTRO:",error);

        res.status(500).json({
            mensaje:"Error al registrar usuario"
        });
    }

});

//  LOGIN 
app.post('/login', async (req,res)=>{

    const {email,password} = req.body;

    try{

        const sql = `
        SELECT id_usuario,id_rol,nombre,email,password,estado,imagen
        FROM usuarios
        WHERE email=?
        `;

        const [result] = await db.query(sql,[email]);

        if(result.length===0){
            return res.status(401).json({
                mensaje:"Usuario no existe"
            });
        }

        const usuario = result[0];

        if(usuario.estado !== "activo"){
            return res.status(403).json({
                mensaje:"Usuario inactivo"
            });
        }

        const valido = await bcrypt.compare(password,usuario.password);

        if(!valido){
            return res.status(401).json({
                mensaje:"Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id:usuario.id_usuario,
                rol:usuario.id_rol
            },
            process.env.JWT_SECRET,
            {expiresIn:'8h'}
        );

        res.json({
            mensaje:"Login correcto",
            token,
            usuario:{
                id:usuario.id_usuario,
                nombre:usuario.nombre,
                email:usuario.email,
                rol:usuario.id_rol,
                imagen:usuario.imagen
            }
        });

    }catch(error){
        console.log("ERROR LOGIN:",error);
        res.status(500).json({mensaje:"Error servidor"});
    }

});

//  SERVIDOR local y conexion de puerto.

app.listen(5000,()=>{
    console.log("Servidor corriendo en http://localhost:5000");
});
