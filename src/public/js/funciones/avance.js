import Swal from 'sweetalert2';
import axios from 'axios';

export const actualizarAvance = () => {
  //Seleccionar las tareas existentes
  const subtareas = document.querySelectorAll('i.fa-check-circle')
  const tarea = document.querySelectorAll('ul#idtarea')
  const estadotarea = document.querySelector('#estadotarea')
  const tareas = document.querySelectorAll('li.tarea');
  const proyecto = document.querySelectorAll('ul#idproyecto')
  const estadoproyecto = document.querySelector('#estadoproyecto')

  if (estadotarea) {
    let subTareasLength = 0;
    let subtareasCompletasLength = 0;

    if (subtareas.length) {
      // Contar el peso de cada tarea
      subtareas.forEach(function (element) {
        subTareasLength = subTareasLength + Number(element.dataset.pesosubtarea)
      })
      // Seleccionar las tareas completadas
      const subtareasCompletas = document.querySelectorAll('i.completo');
      if (subtareasCompletas.length) {
        subtareasCompletas.forEach(element => {
          subtareasCompletasLength = subtareasCompletasLength + Number(element.dataset.pesosubtarea);
        });
      }
      // Calcular el avance
      const avance = Math.round((subtareasCompletasLength / subTareasLength) * 100)

      // Monstrar el avance
      const porcentaje = document.querySelector('#porcentaje');
      porcentaje.style.width = `${avance}%`;

      const porcentajeTexto = document.querySelector('#porcentaje-texto');
      porcentajeTexto.innerHTML = `<h2>Avance de la Tarea: ${avance}%</h2>`

      let estadoActualTarea = estadotarea.dataset.estadotarea;
      if (avance === 100 && estadoActualTarea == 0) {
        const idTarea = tarea[0].dataset.idtarea;
        const url = `${location.origin}/tarea/${idTarea}`
        axios.patch(url, {
          idTarea
        }).then(function (respuesta) {
          if (respuesta.status === 200) {
            document.querySelector('#estadotarea').removeAttribute("data-estadotarea");
            document.querySelector('#estadotarea').setAttribute("data-estadotarea", "1");
          }
        })
      }
      if (avance !== 100 && estadoActualTarea == 1) {
        const idTarea = tarea[0].dataset.idtarea;
        const url = `${location.origin}/tarea/${idTarea}`;
        axios.patch(url, {
          idTarea
        }).then(function (respuesta) {
          if (respuesta.status === 200) {
            document.querySelector('#estadotarea').removeAttribute("data-estadotarea");
            document.querySelector('#estadotarea').setAttribute("data-estadotarea", "0");
          }
        })
      }
    }
  }

  if (estadoproyecto) {
    // seleccionar las tareas existentes
    if (tareas.length) {
      // seleccionar las tareas completadas
      const tareasCompletas = document.querySelectorAll('i.completo');

      // calcular el avance
      const avanceProyecto = Math.round((tareasCompletas.length / tareas.length) * 100);

      // mostrar el avance
      const porcentaje = document.querySelector('#porcentaje');
      porcentaje.style.width = avanceProyecto + '%';

      const porcentajeTexto = document.querySelector('#porcentaje-texto');
      porcentajeTexto.innerHTML = `<h2>Avance del Proyecto: ${avanceProyecto}%</h2>`

      let estadoActualProyecto = estadoproyecto.dataset.estadoproyecto;
      if (avanceProyecto === 100 && estadoActualProyecto == 0) {
        const idProyecto = proyecto[0].dataset.idproyecto;
        const url = `${location.origin}/proyecto/${idProyecto}`
        axios.patch(url, {
          idProyecto
        }).then(function (respuesta) {
          if (respuesta.status === 200) {
            document.querySelector('#estadoproyecto').removeAttribute("data-estadoproyecto");
            document.querySelector('#estadoproyecto').setAttribute("data-estadoproyecto", "1");
          }
        })
      }
      if (avanceProyecto !== 100 && estadoActualProyecto == 1) {
        const idProyecto = proyecto[0].dataset.idproyecto;
        const url = `${location.origin}/proyecto/${idProyecto}`
        axios.patch(url, {
          idProyecto
        }).then(function (respuesta) {
          if (respuesta.status === 200) {
            document.querySelector('#estadoproyecto').removeAttribute("data-estadoproyecto");
            document.querySelector('#estadoproyecto').setAttribute("data-estadoproyecto", "0");
          }
        })
      }
    }
  }
}