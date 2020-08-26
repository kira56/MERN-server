const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    // extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar  que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            })
        }
        // crea nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)
        // guardar usuario
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }

        };
        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            // Mensaje de confirmar
            res.json({ token })
        });
    } catch (error) {
        console.log(error)
        res.status(400).send('Arregla tu huevada');
    }

}