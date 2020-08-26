// Rutas de usuario
const express = require('express');

const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

// api/usuarios
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Revisar que no este vacio
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minino de 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

module.exports = router;
