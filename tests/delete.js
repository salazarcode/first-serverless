const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.delete,{
  params: {
    id: 1503
  }
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error.message);
})