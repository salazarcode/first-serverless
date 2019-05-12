var mysql = require('mysql')
var Util = require('util')
var db = require('../db.json')
const Database = require('../Database/DatabaseClass.js');

var connection = mysql.createConnection({
  "host"            : db.host,    
  "user"            : db.user,
  "password"        : db.password,
  "database"        : db.database
});

async function getDetail(id){
  let database = new Database();
  let track, album, artista;

  await database.query("select * from track where id = " + id)
  .then( rows => track = rows[0] );

  if(track.idAlbum != undefined)
  {
    await database.query("select * from albums where id = " + track.idAlbum)
    .then( rows => track.album = rows );    
  }
  
  await database.query("select a.* from track t inner join trackxartista ta on ta.idTrack = t.id inner join artistas a on a.id = ta.idArtista where t.id =" + track.id)
  .then( rows => track.artista = rows );

  return track;
}

module.exports.create = async function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;  
  
  const body = JSON.parse(event.body);

  var nombre =  body.nombre ? body.nombre : false;

  if(!nombre)
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must provide the track name to create it" }) 
    })
  
  
  let database = new Database();
  let t;

  var q = "insert into track(isrc, isrcVideos, idAlbum, idVideo, idSpotify, idDeezer, idAppleMusic, nombre) ";
  q = q + "values('', '', null, null, null, null, null, '" + nombre + "')";

  await database.query(q)
  .then(rows => {return rows.insertId})
  .then(async id => { t = await getDetail(id) })

  callback(null, { 
    statusCode: 200,  
    body: JSON.stringify({ data: t }) 
  })
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

module.exports.detail = async function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;    
  var id = event.pathParameters.id; 
  if(!id)
  {
    callback(null, { 
      statusCode: 200,  
      body: JSON.stringify({ validation: "You must specify the 'id' to get the detail of a track" })
    })
  }  

  const track = await getDetail(id);

  callback(null, { 
    statusCode: 200,  
    body: JSON.stringify({ data: track })
  })
};

module.exports.update =  async function(event, context, callback) {  
  context.callbackWaitsForEmptyEventLoop = false;

  const body = JSON.parse(event.body);

  let track = {};

  body.id             ? track.id = body.id          : false;
  body.nombre         ? track.nombre = body.nombre      : false;
  body.isrc           ? track.isrc = body.isrc        : false;
  body.isrcVideos     ? track.isrcVideos = body.isrcVideos  : false;
  body.idAlbum        ? track.idAlbum = body.idAlbum     : false;
  body.idVideo        ? track.idVideo = body.idVideo     : false;
  body.idSpotify      ? track.idSpotify = body.idSpotify   : false;
  body.idDeezer       ? track.idDeezer = body.idDeezer    : false;
  body.idAppleMusic   ? track.idAppleMusic = body.idAppleMusic: false;

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
  await connection.query(sql, (error, result) => {
    if (error) throw error
  })
  callback(null, {statusCode: 200});
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
