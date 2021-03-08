const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const Usuarios = require('../model/Usuarios');
const Tipos = require('../model/Tipos');
var _ = require('lodash');
const {
    formatDate,
    nest
} = require('../libs/funciones')
require('../config/asociations');

const meses = ["Ene", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

exports.proyectosHome = async (req, res) => {
    const proyectos = await Proyectos.findAll();

    // Lista de Proyectos por Año
    const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

    const proyectosByTrue = groupByEstadoYear[true];
    const proyectosByFalse = groupByEstadoYear[false];

    if (proyectosByFalse) {
        var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
    }
    if (proyectosByTrue) {
        var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
    }
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos,
        yearsFalse,
        yearsTrue,
        proyectosByFalse,
        proyectosByTrue,
    });
};

exports.formularioProyecto = async (req, res) => {
    const proyectosPromise = Proyectos.findAll();
    const usuariosPromise = Usuarios.findAll();
    const tiposPromise = Tipos.findAll();
    const [usuarios, proyectos, tipos] = await Promise.all([usuariosPromise, proyectosPromise, tiposPromise]);

    // Lista de Proyectos por Año
    const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

    const proyectosByTrue = groupByEstadoYear[true];
    const proyectosByFalse = groupByEstadoYear[false];

    if (proyectosByFalse) {
        var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
    }
    if (proyectosByTrue) {
        var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
    }

    const usuarioPrincipal = [];
    const usuarioRespaldo = [];

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos,
        yearsFalse,
        yearsTrue,
        proyectosByFalse,
        proyectosByTrue,
        usuarios,
        usuarioPrincipal,
        usuarioRespaldo,
        tipos
    });
};

exports.nuevoProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    const {
        nombre,
        descripcion,
        tipo,
        ingeniero_principal,
        ingeniero_secundario,
        time_begin,
        time_end
    } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({
            'texto': 'Agrega un nombre al Proyecto'
        })
    }
    if (!time_begin) {
        errores.push({
            'texto': 'Agrega una fecha de Inicio'
        })
    }
    if (!time_end) {
        errores.push({
            'texto': 'Agrega una fecha de Fin'
        })
    }

    const ingPrincipal = await Usuarios.findByPk(ingeniero_principal);
    const ingRespaldo = await Usuarios.findByPk(ingeniero_secundario);

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        const proyecto = await Proyectos.create({
            nombre,
            descripcion,
            tipoId: tipo,
            time_begin,
            time_end
        });

        if (ingPrincipal) {
            await ingPrincipal.addProyectos(proyecto);
        }
        if (ingRespaldo) {
            await ingRespaldo.addProyectos(proyecto);
        }

        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise = Proyectos.findAll();
    const usuariosPromise = Usuarios.findAll();
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });
    const [proyecto, proyectos, usuarios] = await Promise.all([proyectoPromise, proyectosPromise, usuariosPromise]);

    const proyectoIng = await Proyectos.findByPk(proyecto.id, {
        include: [{
            model: Usuarios,
            as: "usuarios",
            attributes: ["nombre", "role"],
            through: {
                attributes: [],
            }
        }, ],
    });
    const usuarioPrincipal = proyectoIng.usuarios;
    const usuarioRespaldo = proyectoIng.usuarios;

    // Consultar tareas del Proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: {
            model: Proyectos
        }
    });

    if (!proyecto) return next();
    const fecha_inicio = `${meses[proyecto.time_begin.getMonth()]}-${proyecto.time_begin.getFullYear()}`;
    const fecha_fin = `${meses[proyecto.time_end.getMonth()]}-${proyecto.time_end.getFullYear()}`;

    const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

    const proyectosByTrue = groupByEstadoYear[true];
    const proyectosByFalse = groupByEstadoYear[false];

    if (proyectosByFalse) {
        var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
    }
    if (proyectosByTrue) {
        var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
    }

    // Render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyectos,
        proyecto,
        usuarios,
        fecha_inicio,
        fecha_fin,
        tareas,
        yearsFalse,
        yearsTrue,
        proyectosByFalse,
        proyectosByTrue,
        usuarioPrincipal,
        usuarioRespaldo,
    })
}

exports.formularioEditar = async (req, res) => {
    const proyectosPromise = Proyectos.findAll();
    const usuariosPromise = Usuarios.findAll();
    const tiposPromise = Tipos.findAll();
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });
    const [proyecto, proyectos, usuarios, tipos] = await Promise.all([proyectoPromise, proyectosPromise, usuariosPromise, tiposPromise]);
    const fecha_inicio = formatDate(proyecto.time_begin);
    const fecha_fin = formatDate(proyecto.time_end);

    const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

    const proyectosByTrue = groupByEstadoYear[true];
    const proyectosByFalse = groupByEstadoYear[false];

    if (proyectosByFalse) {
        var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
    }
    if (proyectosByTrue) {
        var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
    }

    const proyectoIng = await Proyectos.findByPk(proyecto.id, {
        include: [{
            model: Usuarios,
            as: "usuarios",
            attributes: ["id", "nombre", "role"],
            through: {
                attributes: [],
            }
        }, ],
    });
    const usuarioPrincipal = proyectoIng.usuarios;
    const usuarioRespaldo = proyectoIng.usuarios;

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto,
        yearsFalse,
        yearsTrue,
        proyectosByFalse,
        proyectosByTrue,
        usuarios,
        usuarioPrincipal,
        usuarioRespaldo,
        fecha_inicio,
        fecha_fin,
        tipos
    })
}

exports.actualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    const {
        nombre,
        descripcion,
        tipo,
        ingeniero_principal,
        ingeniero_secundario,
        time_begin,
        time_end
    } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({
            'texto': 'Agrega un nombre al Proyecto'
        })
    }

    const ingPrincipal = await Usuarios.findByPk(ingeniero_principal);
    const ingRespaldo = await Usuarios.findByPk(ingeniero_secundario);

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        await Proyectos.update({
            nombre,
            descripcion,
            tipoId: tipo,
            time_begin,
            time_end
        }, {
            where: {
                id: req.params.id
            }
        });
        const proyecto = await Proyectos.findByPk(req.params.id, {
            include: [{
                model: Usuarios,
                as: "usuarios",
                attributes: ["id"],
                through: {
                    attributes: [],
                }
            }, ],
        });
        const {
            usuarios
        } = proyecto;
        usuarios.forEach(async usuario => {
            await usuario.removeProyectos(proyecto);
        });
        if (ingPrincipal) {
            await ingPrincipal.addProyectos(proyecto);
        }
        if (ingRespaldo) {
            await ingRespaldo.addProyectos(proyecto);
        }
        res.redirect('/');
    }
}


exports.eliminarProyecto = async (req, res, next) => {
    // Eliminar puedes usar req params o query
    const {
        urlProyecto
    } = req.query;
    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });

    if (!resultado) {
        return next();
    }
    res.status(200).send('Proyecto Eliminado Correctamente');
}

exports.cambiarEstadoProyecto = async (req, res, next) => {
    const {
        id
    } = req.params;
    const proyecto = await Proyectos.findOne({
        where: {
            id
        }
    })
    // Cambiar Estado
    let estado = false;
    if (proyecto.estado === estado) {
        estado = true;
    }
    proyecto.estado = estado;

    const resultado = await proyecto.save();
    if (!resultado) return next();

    res.status(200).send('Actualizado');
}