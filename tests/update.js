const axios = require('axios');
var rutas = require('./rutas.json')

axios.post(rutas.update, {
  id: 1500,
  nombre: 'otro 1500'
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});