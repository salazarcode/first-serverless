const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.detail + "1515",{
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})