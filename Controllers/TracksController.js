var mysql = require('mysql')
var db = require('../db.json')

var connection = mysql.createConnection({
  "host"            : db.host,    
  "user"            : db.user,
  "password"        : db.password,
  "database"        : db.database
});

module.exports.create = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;  
  var nombreInput =  event.queryStringParameters && event.queryStringParameters.nombre ? event.queryStringParameters.nombre : false;
  if(!(nombreInput))
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must provide the track name to create it" }) 
    })
  }
  connection.query('insert into track set ?', {nombre: nombreInput}, function (error, results, fields) {
    if (error) {
      callback({
        statusCode: 500,
        body: JSON.stringify(error)
      })
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          inserted: results.insertId
        })
      })
    }
  });
};

module.exports.retrieve = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;
  
  var nombre = event.queryStringParameters && event.queryStringParameters.nombre ? event.queryStringParameters.nombre : false;
  var isrc = event.queryStringParameters && event.queryStringParameters.isrc ? event.queryStringParameters.isrc : false;
  var idAlbum = event.queryStringParameters && event.queryStringParameters.idAlbum ? event.queryStringParameters.idAlbum : false;    
  var idArtista = event.queryStringParameters && event.queryStringParameters.idArtista ? event.queryStringParameters.idArtista : false; 
  
  var perpage = event.queryStringParameters && event.queryStringParameters.perpage ? event.queryStringParameters.perpage : false;
  var lastrecord = event.queryStringParameters && event.queryStringParameters.lastrecord ? event.queryStringParameters.lastrecord : false; 

  var query = "select a.id as idArtista, t.*";
  query = query + "from track t ";
  query = query + "inner join trackxartista ta on t.id = ta.idTrack ";
  query = query + "inner join artistas a on ta.idArtista = a.id where 1=1 ";

  query = query + (nombre ? "and nombre like '%" + nombre + "%' " : "");
  query = query + (isrc ? "and isrc = '%" + isrc + "%' " : "");
  query = query + (idAlbum ? "and idAlbum = " + idAlbum + " " : "");
  query = query + (idArtista ? "and idArtista = " + idArtista + " " : "");
  if(perpage)
  {
    if(lastrecord)
    {
      query = query + " limit " + lastrecord + ", " + perpage;
    }
    else
    {
      query = query + " limit " + perpage;
    }    
  }

  connection.query(query, (error, rows) => {
      callback(
        error ? { statusCode: 500,  body: JSON.stringify({ error: error }) } : null, 
        !error ? { statusCode: 200,  body: JSON.stringify({ data: rows }) } : null
      ) 
  })    
};

module.exports.update = function(event, context, callback){  
  context.callbackWaitsForEmptyEventLoop = false;
  var nombre = event.queryStringParameters && event.query
  StringParameters.nombre ? event.queryStringParameters.nombre : false;
  var isrc = event.queryStringParameters && event.queryStringParameters.isrc ? event.queryStringParameters.isrc : false;
  var isrcVideos = event.queryStringParameters && event.queryStringParameters.isrcVideos ? event.queryStringParameters.isrcVideos : false;
  var idAlbum = event.queryStringParameters && event.queryStringParameters.idAlbum ? event.queryStringParameters.idAlbum : false;
  var idVideo = event.queryStringParameters && event.queryStringParameters.idVideo ? event.queryStringParameters.idVideo : false;
  var idSpotify = event.queryStringParameters && event.queryStringParameters.idSpotify ? event.queryStringParameters.idSpotify : false;
  var idDeezer = event.queryStringParameters && event.queryStringParameters.idDeezer ? event.queryStringParameters.idDeezer : false;
  var idAppleMusic = event.queryStringParameters && event.queryStringParameters.idAppleMusic ? event.queryStringParameters.idAppleMusic : false;
  var id = event.queryStringParameters && event.queryStringParameters.id ? event.queryStringParameters.id : false;
   
  if(!(id && nombre && isrc && isrcVideos && idAlbum && idVideo && idSpotify && idDeezer && idAppleMusic))
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must provide all fields to update a row" }) 
    })
  }

  var sql = "update track set ";
  sql = sql + (nombre ? "nombre = '" + nombre + "', " : "");
  sql = sql + (isrc ? "isrc = '" + isrc + "', " : "");
  sql = sql + (isrcVideos ? "isrcVideos = '" + isrcVideos + "', " : "");
  sql = sql + (idAlbum ? "idAlbum = " + idAlbum + ", " : "");
  sql = sql + (idVideo ? "idVideo = " + idVideo + ", " : "");
  sql = sql + (idSpotify ? "idSpotify = " + idSpotify + ", " : "");
  sql = sql + (idDeezer ? "idDeezer = " + idDeezer + ", " : "");
  sql = sql + (idAppleMusic ? "idAppleMusic = " + idAppleMusic + " " : "");
  sql = sql + ("where id = " + id);
  
  connection.query(sql, function(error, result) {
    callback(
      error ? { statusCode: 500,  body: JSON.stringify({ error: error }) } : null, 
      !error ? { statusCode: 200,  body: JSON.stringify({ message: "Update succeded" }) } : null
    ) 
  });
};

module.exports.delete = function(event, context, callback){  
  context.callbackWaitsForEmptyEventLoop = false;
  if(!(event.queryStringParameters.id))
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must provide the 'id' of the row to be deleted" }) 
    })
  }
  const sql = 'delete from track where id = ?';
  connection.query(sql, [event.queryStringParameters.id], (error, result) => {
    if (error) {
      callback({
        statusCode: 500,
        body: JSON.stringify(error)
      })
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          res: 'Deleted ok'
        })
      })
    }
  })
};
