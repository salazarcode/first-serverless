const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.detail + "1505",{
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})