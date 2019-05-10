var mysql = require('mysql')
var Util = require('util')
var db = require('../db.json')

var connection = mysql.createConnection({
  "host"            : db.host,    
  "user"            : db.user,
  "password"        : db.password,
  "database"        : db.database
});

module.exports.detail = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;  
    var id = event.pathParameters.id; 
    //var id = 3732;
    if(!id)
    {
      callback(null, { 
        statusCode: 200,  
        body: JSON.stringify({ validation: "You must specify the 'id' to get the detail of a track" })
      })
    }  
    const query = Util.promisify(connection.query).bind(connection);
    var temp = await query("select * from albums where id = " + id);
    const album = temp[0];

    var q = "select t.* from track t left outer join trackxartista ta on ta.idTrack = t.id left outer join artistas a on a.id = ta.idArtista where idAlbum =" + album.id;
    album.tracks = await query(q);
    for(let n = 0; n < album.tracks.length; n++)
    {
      const query = Util.promisify(connection.query).bind(connection);
      album.tracks[n].artista = await query("select a.* from track t inner join trackxartista ta on ta.idTrack = t.id inner join artistas a on ta.idArtista = a.id where t.id = " + album.tracks[0].id);
    }

  
    callback(null, {
        statusCode: 200, 
        body: JSON.stringify({data:album})
    });
  };
