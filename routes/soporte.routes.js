const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// CONFIGURAR TRANSPORTADOR UNA SOLA VEZ
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/', async (req, res) => {
    try {
        const { mensaje } = req.body;

        // 🔒 Validación
        if (!mensaje) {
            return res.status(400).json({
                error: 'El mensaje es obligatorio'
            });
        }

        await transporter.sendMail({
            from: `"Soporte Sistema" <${process.env.EMAIL_USER}>`,
            to: 'lopezgcarlos5@gmail.com',
            subject: 'Nuevo mensaje de soporte',
            text: mensaje
        });

        res.json({
            ok: true,
            mensaje: 'Mensaje enviado correctamente'
        });

    } catch (error) {
        console.error('Error en soporte:', error);

        res.status(500).json({
            error: 'Error al enviar el mensaje'
        });
    }
});

module.exports = router;