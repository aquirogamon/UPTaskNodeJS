const subtareas = document.querySelector('#listado-pendientes-subtareas');
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  actualizarAvance
} from '../funciones/avance'

if (subtareas) {
  subtareas.addEventListener('click', e => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idSubTarea = icono.parentElement.parentElement.dataset.subtarea
      const url = `${location.origin}/tarea/subtarea/${idSubTarea}`
      axios.patch(url, {
          idSubTarea
        })
        .then(function (respuesta) {
          if (respuesta.status === 200) {
            icono.classList.toggle('completo');
            actualizarAvance();
          }
        })
    }
    // if (e.target.classList.contains('fa-edit')) {
    //   const icono = e.target;
    //   const idSubTarea = icono.parentElement.parentElement.dataset.subtarea
    //   const url = `${location.origin}/tarea/subtarea/editar/${idSubTarea}`
    //   axios.get(url)
    // }
    if (e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement;
      const idSubTarea = tareaHTML.dataset.subtarea
      Swal.fire({
        title: 'Deseas borrar esta subtarea?',
        text: "Una subtarea eliminada no se puede recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Borrar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `${location.origin}/tarea/subtarea/${idSubTarea}`
          axios.delete(url, {
              params: {
                idSubTarea
              }
            })
            .then(function (res) {
              if (res.status === 200) {
                tareaHTML.parentElement.removeChild(tareaHTML);
                Swal.fire(
                  'SubTarea Eliminada',
                  res.data,
                  'success'
                );
                actualizarAvance();
              }
            })
        }
      })
    }
  })
}

export default subtareas;