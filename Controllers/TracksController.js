var mysql = require('mysql')
var connection = mysql.createConnection({
    "host"            : "mojoexternals.cpse5vpaifmp.us-east-2.rds.amazonaws.com",
    "user"            : "mojodev",
    "password"        : "mojo1234",
    "database"        : "mojodev"
});

module.exports.create = function(event, context, callback){
};

module.exports.retrieve = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;
  
  var nombre = event.queryStringParameters && event.queryStringParameters.nombre ? event.queryStringParameters.nombre : "";
  var isrc = event.queryStringParameters && event.queryStringParameters.isrc ? event.queryStringParameters.isrc : "";
  var idAlbum = event.queryStringParameters && event.queryStringParameters.idAlbum ? event.queryStringParameters.idAlbum : "";    
  var idArtista = event.queryStringParameters && event.queryStringParameters.idArtista ? event.queryStringParameters.idArtista : ""; 
  
  var perpage = event.queryStringParameters && event.queryStringParameters.perpage ? event.queryStringParameters.perpage : "";
  var lastrecord = event.queryStringParameters && event.queryStringParameters.lastrecord ? event.queryStringParameters.lastrecord : ""; 

  var query = "select a.id as idArtista, a.nombres as nombresArtista, t.*";
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
};

module.exports.delete = function(event, context, callback){
};
