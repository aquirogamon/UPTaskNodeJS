const listatareas = document.querySelectorAll('#listado-tareas');
import axios from 'axios';
// import Swal from 'sweetalert2';
import {
  actualizarAvance
} from '../funciones/avance'

if (listatareas) {
  listatareas.forEach(div => {
    div.addEventListener('click', e => {
      if (e.target.classList.contains('fa-check-circle')) {
        const icono = e.target;
        const idTarea = icono.parentElement.parentElement.dataset.tarea
        const url = `${location.origin}/tarea/${idTarea}`
        axios.patch(url, {
            idTarea
          })
          .then(function (respuesta) {
            if (respuesta.status === 200) {
              icono.classList.toggle('completo');
              actualizarAvance();
            }
          })
      }
      // if (e.target.classList.contains('fa-trash')) {
      //   const tareaHTML = e.target.parentElement.parentElement;
      //   const idTarea = tareaHTML.dataset.tarea
      //   Swal.fire({
      //     title: 'Deseas borrar esta tarea?',
      //     text: "Una tarea eliminada no se puede recuperar",
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Sí, Borrar!',
      //     cancelButtonText: 'No, Cancelar'
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       const url = `${location.origin}/tarea/${idTarea}`;
      //       axios.delete(url, {
      //           params: {
      //             idTarea
      //           }
      //         })
      //         .then(function (res) {
      //           if (res.status === 200) {
      //             tareaHTML.parentElement.removeChild(tareaHTML);
      //             Swal.fire(
      //               'Tarea Eliminada',
      //               res.data,
      //               'success'
      //             );
      //             actualizarAvance();
      //           }
      //         })
      //     }
      //   })
      // }
    })
  })
}

export default listatareas;