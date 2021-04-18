import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'
import subtareas from './modulos/subtareas'
import listatareas from './modulos/listatareas'
import navbar from './modulos/navbar'

import {
  actualizarAvance
} from './funciones/avance'

document.addEventListener('DOMContentLoaded', () => {
  actualizarAvance();
});