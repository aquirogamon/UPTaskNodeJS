const lista = document.querySelector('#listaTarea');
const sublista = document.querySelector('#sublistaTarea');

if (lista) {
    lista.onmouseover = ver;
    lista.onmouseout = ocultar;
}

function ver() {
    sublista.style.display = "block";
};

function ocultar() {
    sublista.style.display = "none";
}