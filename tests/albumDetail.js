const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.albumDetail + "8",{
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})

