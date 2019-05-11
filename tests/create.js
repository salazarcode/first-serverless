const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.create,{
  params: {
    nombre: "Canta tú"
  }
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})