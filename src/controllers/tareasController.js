const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const Usuarios = require('../model/Usuarios');
var _ = require('lodash');
const {
  formatDate,
  nest,
  removeNullFromArray
} = require('../libs/funciones')

exports.agregarTarea = async (req, res) => {
  const {
    url
  } = req.params;
  // Buscar Proyecto Actual
  const proyectosPromise = Proyectos.findAll();
  const usuariosPromise = Usuarios.findAll();
  const proyectoPromise = Proyectos.findOne({
    where: {
      url
    }
  });
  const [proyecto, proyectos, usuarios] = await Promise.all([proyectoPromise, proyectosPromise, usuariosPromise]);

  const {
    nombre,
    ingeniero_principal,
    time_begin,
    time_end
  } = req.body;
  proyectoId = proyecto.id;

  // Grabar tarea en DB
  let errores = [];

  if (!nombre) {
    errores.push({
      'texto': 'Agrega un nombre de la Tarea'
    })
  }

  const ingPrincipal = await Usuarios.findByPk(ingeniero_principal);
  const ingenieros = removeNullFromArray([ingPrincipal])

  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nueva Tarea',
      errores,
      proyectos
    })
  } else if (!time_begin || !time_end) {
    await Tareas.create({
      nombre,
      proyectoId,
    });
    if (ingenieros) {
      tarea.setUsuarios(ingenieros);
    }
    res.redirect(`/proyecto/${url}`);
  } else {
    await Tareas.create({
      nombre,
      time_begin,
      time_end,
      proyectoId,
    });
    if (ingenieros) {
      tarea.setUsuarios(ingenieros);
    }
    res.redirect(`/proyecto/${url}`);
  }
}

exports.cambiarEstadoTarea = async (req, res, next) => {
  const {
    id
  } = req.params;
  const tarea = await Tareas.findOne({
    where: {
      id
    }
  })
  // Cambiar Estado
  let estado = false;
  let avance = 0;
  if (tarea.estado === estado) {
    estado = true;
    avance = 100
  }
  tarea.estado = estado;
  tarea.avance = avance;

  const resultado = await tarea.save();
  if (!resultado) return next();

  res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res) => {
  // Eliminar puedes usar req params o query
  const {
    id
  } = req.params;
  const resultado = await Tareas.destroy({
    where: {
      id
    }
  });

  if (!resultado) {
    return next();
  }
  res.status(200).send('Tarea Eliminada Correctamente');
}

exports.formularioEditar = async (req, res) => {
  const proyectosPromise = Proyectos.findAll();
  const usuariosPromise = Usuarios.findAll();
  const tareaPromise = Tareas.findOne({
    where: {
      id: req.params.id
    }
  });
  const [tarea, proyectos, usuarios] = await Promise.all([tareaPromise, proyectosPromise, usuariosPromise]);

  const fecha_inicio = formatDate(tarea.time_begin);
  const fecha_fin = formatDate(tarea.time_end);

  const proyecto = await Proyectos.findOne({
    where: {
      id: tarea.proyectoId
    }
  });

  const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

  const proyectosByTrue = groupByEstadoYear[true];
  const proyectosByFalse = groupByEstadoYear[false];

  if (proyectosByFalse) {
    var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
  }
  if (proyectosByTrue) {
    var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
  }

  const tareaIng = await Tareas.findByPk(tarea.id, {
    include: [{
      model: Usuarios,
      as: "usuarios",
      attributes: ["id", "nombre", "role"],
      through: {
        attributes: [],
      }
    }, ],
  });
  const usuarioPrincipal = tareaIng.usuarios;
  const usuarioRespaldo = tareaIng.usuarios;

  res.render('editarTarea', {
    nombrePagina: 'Editar Tarea',
    proyectos,
    proyecto,
    tarea,
    yearsFalse,
    yearsTrue,
    proyectosByFalse,
    proyectosByTrue,
    usuarios,
    usuarioPrincipal,
    usuarioRespaldo,
    fecha_inicio,
    fecha_fin
  });
};

exports.actualizarTarea = async (req, res) => {
  const {
    nombre,
    prioridad,
    time_begin,
    time_end,
    ingeniero_principal,
    ingeniero_secundario
  } = req.body;
  let errores = [];

  // Buscar la Tarea asociada
  const idTarea = req.params.id
  const tareaId = await Tareas.findByPk(idTarea);
  // Buscar el Proyecto asociada
  const idProyecto = tareaId.proyectoId
  const proyecto = await Proyectos.findByPk(idProyecto);

  if (!nombre) {
    errores.push({
      'texto': 'Agrega un nombre a la Tarea'
    })
  }
  if (time_end) {
    if (new Date(time_end) > new Date(proyecto.time_end)) {
      proyecto.time_end = time_end
      await proyecto.save();
    }
  }
  const ingPrincipal = await Usuarios.findByPk(ingeniero_principal);
  const ingRespaldo = await Usuarios.findByPk(ingeniero_secundario);
  const ingenieros = removeNullFromArray([ingPrincipal, ingRespaldo])

  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos
    })
  } else {
    await Tareas.update({
      nombre,
      prioridad,
      time_begin,
      time_end,
    }, {
      where: {
        id: idTarea
      }
    });
    const tarea = await Tareas.findByPk(req.params.id, {
      include: [{
        model: Usuarios,
        as: "usuarios",
        attributes: ["id"],
        through: {
          attributes: [],
        }
      }, ],
    });

    if (ingenieros) {
      tarea.setUsuarios(ingenieros);
    }
    res.redirect(`/proyecto/${proyecto.url}/${tarea.url_tarea}`);
  }
}

exports.cambiarAvanceTarea = async (req, res, next) => {
    const {
        avance,
        id
    } = req.params;

    const tarea = await Tareas.findOne({
        where: {
            id
        }
    })
    // Cambiar Estado
    let avanceTarea = tarea.avance;
    if (avanceTarea !== avance) {
      avanceTarea = avance;
    }
    tarea.avance = avanceTarea;

    const resultado = await tarea.save();
    if (!resultado) return next();

    res.status(200).send('Actualizado');
}