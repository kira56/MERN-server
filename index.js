const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors')

// crea el servidor
const app = express();
// Conectar a la base de datos
conectarDB();

//Habilitar CORS
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }))

// puerto de la app
const port = process.env.port || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));



// definir la pagina principal
app.get('/', (req, res) => {
    res.send('Hola Diego')
})

// arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto : ${port}`)
})
