import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');
const btnActualizarFechas = document.querySelector('#actualizar-fechas');

if (btnEliminar) {
  btnEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    Swal.fire({
      title: 'Deseas borrar este proyecto?',
      text: "Un proyecto eliminado no se puede recuperar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Borrar!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/proyecto/${urlProyecto}`;
        axios.delete(url, {
            params: {
              urlProyecto
            }
          })
          .then(function (res) {
            Swal.fire(
              'Proyecto Eliminado',
              res.data,
              'success'
            );
            setTimeout(() => {
              window.location.href = '/'
            }, 3000);
          }).
        catch((err) => {
          Swal.fire({
            type: 'error',
            title: 'Hubo un error',
            text: 'No se pudo eliminar el Proyecto'
          })
        })
      }
    })
  })
}

if (btnActualizarFechas) {
  btnActualizarFechas.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl
    const url = `${location.origin}/proyecto/actualizarfechas/${urlProyecto}`;
    console.log(url)
    axios.patch(url, {
      params: {
        urlProyecto
      }
    })
    .then(function (res) {
      setTimeout(() => {
        window.location.href = `/proyecto/${urlProyecto}`
      }, 1000);
    })
  })
}

export default btnEliminar;