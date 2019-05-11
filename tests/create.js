const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.create,{
  params: {
    nombre: "Una última prueba"
  }
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})