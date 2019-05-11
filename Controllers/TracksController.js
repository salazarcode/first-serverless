var mysql = require('mysql')
var Util = require('util')
var db = require('../db.json')
const Database = require('./DatabaseClass.js');



var connection = mysql.createConnection({
  "host"            : db.host,    
  "user"            : db.user,
  "password"        : db.password,
  "database"        : db.database
});

module.exports.create = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;  
  var nombre =  event.queryStringParameters && event.queryStringParameters.nombre ? event.queryStringParameters.nombre : false;
  if(!nombre)
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must provide the track name to create it" }) 
    })
  
  var q = "insert into track(isrc, isrcVideos, idAlbum, idVideo, idSpotify, idDeezer, idAppleMusic, nombre) values('', '', null, null, null, null, null, '" + nombre + "')";

  connection.query(q, function (error, results, fields) {
    if (error) throw error;
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        inserted: results.insertId
      })
    })
  });
};

module.exports.retrieve = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;
  
  var nombre = event.queryStringParameters && event.queryStringParameters.nombre ? event.queryStringParameters.nombre : false;
  var isrc = event.queryStringParameters && event.queryStringParameters.isrc ? event.queryStringParameters.isrc : false;
  var idAlbum = event.queryStringParameters && event.queryStringParameters.idAlbum ? event.queryStringParameters.idAlbum : false;    
  var idArtista = event.queryStringParameters && event.queryStringParameters.idArtista ? event.queryStringParameters.idArtista : false; 
  
  var perpage = event.queryStringParameters && event.queryStringParameters.perpage ? event.queryStringParameters.perpage : false;
  var page = event.queryStringParameters && event.queryStringParameters.page ? event.queryStringParameters.page : false; 
  //var perpage = 2;
  //var page = 1;
  var totalRows = 0;
 
  if(!(perpage && page))
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must specify a 'page' and a 'perpage' argument" })
    })
  }

  var subquery = "select count(*)";
  subquery = subquery + "from track t ";
  subquery = subquery + "left outer join trackxartista ta on t.id = ta.idTrack ";
  subquery = subquery + "left outer join artistas a on ta.idArtista = a.id where 1=1 ";
  subquery = subquery + (nombre ? "and nombre like '%" + nombre + "%' " : "");
  subquery = subquery + (isrc ? "and isrc = '%" + isrc + "%' " : "");
  subquery = subquery + (idAlbum ? "and idAlbum = " + idAlbum + " " : "");
  subquery = subquery + (idArtista ? "and idArtista = " + idArtista + " " : "");

  var query = "select t.*, ";
  query = query + "("+ subquery +") as total ";
  query = query + "from track t ";
  query = query + "left outer join trackxartista ta on t.id = ta.idTrack ";
  query = query + "left outer join artistas a on ta.idArtista = a.id where 1=1 ";
  query = query + (nombre ? "and nombre like '%" + nombre + "%' " : "");
  query = query + (isrc ? "and isrc = '%" + isrc + "%' " : "");
  query = query + (idAlbum ? "and idAlbum = " + idAlbum + " " : "");
  query = query + (idArtista ? "and idArtista = " + idArtista + " " : "");
  query = query + " limit " + (page - 1) + ", " + perpage;

  connection.query(query, async (error, rows) => {
    if(error) throw error;

    if(rows.length != 0)
    {
      for(let n = 0; n < rows.length; n++)
      {
        const query = Util.promisify(connection.query).bind(connection);
        rows[n].artista = await query("select a.* from track t inner join trackxartista ta on ta.idTrack = t.id inner join artistas a on ta.idArtista = a.id where t.id = " + rows[0].id);
      }
      callback(null, { 
        statusCode: 200,  
        body: JSON.stringify({ 
          data: rows, 
          pagination: {
              records_per_page: perpage,
              current_page: page,
              total_pages: Math.ceil(rows[0].total / perpage),
              totalRows: rows[0].total
          } 
        }) 
      })      
    }
    else
    {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          res: 'No rows found'
        })
      })
    }
  })    
};

module.exports.detail = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;    
  var id = event.pathParameters.id; 
  if(!id)
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must specify the 'id' to get the detail of a track" })
    })
  }  

  let track, album, artista;
  let database = new Database();
  database.query("select * from track where id = " + id)
  .then( rows => {
    track = rows[0];
    return database.query("select * from albums where id = " + track.idAlbum);
  })
  .then( rows => {
    album = rows;
    return database.query("select al.* from track t inner join albums al on al.id = t.idAlbum where t.id = " + id);
  })
  .then( rows => {
    track.album = album;
    track.artista = rows;
    database.close();
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        data: track
      })
    })      
  })
};

module.exports.update = function(event, context, callback) {  
  context.callbackWaitsForEmptyEventLoop = false;
  var id = event.queryStringParameters && event.queryStringParameters.id ? event.queryStringParameters.id : false;
  var nombre = event.queryStringParameters && event.queryStringParameters.nombre ? event.queryStringParameters.nombre : false;
  var isrc = event.queryStringParameters && event.queryStringParameters.isrc ? event.queryStringParameters.isrc : false;
  var isrcVideos = event.queryStringParameters && event.queryStringParameters.isrcVideos ? event.queryStringParameters.isrcVideos : false;
  var idAlbum = event.queryStringParameters && event.queryStringParameters.idAlbum ? event.queryStringParameters.idAlbum : false;
  var idVideo = event.queryStringParameters && event.queryStringParameters.idVideo ? event.queryStringParameters.idVideo : false;
  var idSpotify = event.queryStringParameters && event.queryStringParameters.idSpotify ? event.queryStringParameters.idSpotify : false;
  var idDeezer = event.queryStringParameters && event.queryStringParameters.idDeezer ? event.queryStringParameters.idDeezer : false;
  var idAppleMusic = event.queryStringParameters && event.queryStringParameters.idAppleMusic ? event.queryStringParameters.idAppleMusic : false;


  var track = event.queryStringParameters;
  var permitidos = [ "nombre", "isrc", "isrcVideos", "idAlbum", "idVideo", "idSpotify", "idDeezer", "idAppleMusic" ];
  var sets = [];
  var keys = Object.keys(track);
  var cadena = "";

  keys.forEach(element => {
    if(permitidos.includes(element) && element != "id")
    {
      var valor = isNaN(track[element]) ? "'" + track[element] + "'" : track[element];
      sets.push(element + "=" + valor )
    }
    cadena = sets.join(',')
  });

  const sql = "update track set " + cadena + " where id = "  + track.id;
  connection.query(sql, (error, result) => {
    if (error) throw error
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        res: 'Updated'
      })
    })
  })
};

module.exports.delete = function(event, context, callback){  
  context.callbackWaitsForEmptyEventLoop = false;
  if(!(event.queryStringParameters.id))
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ 
        validation: "You must provide the 'id' of the row to be deleted" 
      }) 
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
