const express = require('express');
const router = express.Router();

// Importar Express Validator
const {
    body
} = require('express-validator')

// Importar controllers
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const subtareasController = require('../controllers/subtareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController')

module.exports = function () {
    // Ruta para el home
    router.get('/', authController.usuarioAutenticado, proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', body('nombre').not().isEmpty().trim().escape(), authController.usuarioAutenticado, proyectosController.nuevoProyecto);

    // Listar Proyecto
    router.get('/proyecto/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);
    // Editar Proyecto
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
    // Actualizar Proyecto
    router.post('/nuevo-proyecto/:id', body('nombre').not().isEmpty().trim().escape(), authController.usuarioAutenticado, proyectosController.actualizarProyecto);
    // Actualizar Estado del Proyecto
    router.patch('/proyecto/:id', authController.usuarioAutenticado, proyectosController.cambiarEstadoProyecto);
    // Actualizar Avance del Proyecto
    router.patch('/proyecto/avance/:id/:avance', authController.usuarioAutenticado, proyectosController.cambiarAvanceProyecto);
    // Actualizar fechas del proyecto
    router.patch('/proyecto/actualizarfechas/:url', proyectosController.actualizarFechasProyecto);
    // Eliminar Proyecto
    router.delete('/proyecto/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);

    // Agregar Tarea
    router.post('/proyecto/:url', authController.usuarioAutenticado, tareasController.agregarTarea);
    // Editar Tarea
    router.get('/proyecto/tarea/editar/:id', authController.usuarioAutenticado, tareasController.formularioEditar);
    // Actualizar Estado de Tarea
    router.patch('/tarea/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);
    // Actualizar Avance de Tarea
    router.patch('/tarea/avance/:id/:avance', authController.usuarioAutenticado, tareasController.cambiarAvanceTarea);
    // Actualizar Estado de Tarea
    router.post('/proyecto/tarea/:id', authController.usuarioAutenticado, tareasController.actualizarTarea);
    // Eliminar una Tarea
    router.delete('/tarea/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);

    // Listar SubTarea
    router.get('/proyecto/:url/:url_tarea', authController.usuarioAutenticado, subtareasController.tareaPorUrl);
    // Agregar SubTarea
    router.post('/proyecto/:url/:url_tarea', authController.usuarioAutenticado, subtareasController.agregarSubTarea);
    // Editar SubTarea
    router.get('/proyecto/tarea/subtarea/editar/:id', authController.usuarioAutenticado, subtareasController.formularioEditar);
    // Actualizar SubTarea
    router.post('/proyecto/tarea/subtarea/:id', authController.usuarioAutenticado, subtareasController.actualizarSubTarea);
    // Cambiar Estado de SubTarea
    router.patch('/tarea/subtarea/:id', authController.usuarioAutenticado, subtareasController.cambiarEstadoSubTarea);
    // Eliminar una Tarea
    router.delete('/tarea/subtarea/:id', authController.usuarioAutenticado, subtareasController.eliminarSubTarea);

    // Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:email', usuariosController.confirmarCuenta);

    // Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.auntenticarUsuario)
    router.get('/cerrar-sesion', authController.cerrarSession)

    // Cuenta Local
    router.get('/cuenta-local', usuariosController.formIniciarSesionLocal)
    router.post('/cuenta-local', authController.autenticarUsuarioLocal)
    router.get('/cerrar-sesion', authController.cerrarSession)

    // Reestablecer Contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)

    // Listar Tareas del Ingeniero
    router.get('/lista-tareas', authController.usuarioAutenticado, dashboardController.listaTareas);
    // Diagrama de Gantt
    router.get('/diagrama-gantt', dashboardController.diagramaGantt);
    router.get('/diagrama-gantt/data', dashboardController.diagramaGanttData);

    return router;
};