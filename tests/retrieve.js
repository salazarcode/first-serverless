const axios = require('axios');
var rutas = require('./rutas.json')

axios.get(rutas.retrieve,{
    params: {
      perpage: 2,
      page: 1,
      idAlbum: 10
    }
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error.message);
  })