const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.update,{
  params: {
    id: 1505,
    idAlbum: 10,
    nombre:"Ejecutado"
  }
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})