_ = require('lodash');

function nest(seq, keys) {
  if (!keys.length)
    return seq;
  var first = keys[0];
  var rest = keys.slice(1);
  return _.mapValues(_.groupBy(seq, first), function (value) {
    return nest(value, rest)
  });
};

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

function quitarAcentos(cadena) {
  const acentos = {
    'á': 'a',
    'é': 'e',
    'í': 'i',
    'ó': 'o',
    'ú': 'u',
    'Á': 'A',
    'É': 'E',
    'Í': 'I',
    'Ó': 'O',
    'Ú': 'U'
  };
  return cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
}

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const removeNullFromArray = (arrayToClean) => {
  const cleanedArray = [];
  arrayToClean.forEach((val) => {
    if(val !== null){
      cleanedArray.push(val);
    }
  });

  return cleanedArray;
}

module.exports = {
  nest,
  formatDate,
  quitarAcentos,
  removeAccents,
  removeNullFromArray
};


