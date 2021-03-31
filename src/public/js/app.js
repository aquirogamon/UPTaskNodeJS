import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'
import subtareas from './modulos/subtareas'
import listatareas from './modulos/listatareas'
import otros from './modulos/otros'
import {
  actualizarAvance
} from './funciones/avance'

document.addEventListener('DOMContentLoaded', () => {
  actualizarAvance();
});