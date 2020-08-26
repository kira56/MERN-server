const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }
    //Extraer proyecto y comprobar si existe
    try {
        const { proyecto } = req.body;
        // Comprobar si el proyecto existe
        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error)
        res.status(500).send('hubo un error')
    }
}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    //extraemos el proyecto
    try {
        const { proyecto } = req.query;
        console.log(req.query)
        // Comprobar si el proyecto existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

// Actualizar tarea

exports.actualizarTarea = async (req, res) => {


    try {

        // Extraer la tarea
        const { proyecto, nombre, estado } = req.body;

        //Ubicar el proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Comprobar si existe la tarea
        const existeTarea = await Tarea.findById(req.params.id);

        //Comprobar si existe la tarea
        if (!existeTarea) {
            return res.status(404).send({ msg: 'No existe la tarea' });
        }

        //Revisar si el usuario autenticado es el dueño del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No autorizado' });
        }

        //Crear nuevo objeto con la nueva informacion
        const nuevaTarea = {};
        console.log(estado)
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la Tarea
        const tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true })
        res.json({ tarea })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // extraer el proyecto
        const { proyecto } = req.query;

        //Revisar Id
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrado' });
        }

        const existeProyecto = await Proyecto.findById(proyecto)

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).send({ msg: 'No autorizado' });
        }


        // Eliminar el proyecto
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' })

    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor')
    }
}



