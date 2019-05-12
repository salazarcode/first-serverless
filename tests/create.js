const axios = require('axios');
var rutas = require('./rutas.json')

axios.post(rutas.create, {
  nombre: 'Creado con las últimas optimizaciones'
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});