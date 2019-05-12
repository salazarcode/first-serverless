var mysql = require('mysql')
var db = require('./db.json')
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection({
          "host"            : db.host,    
          "user"            : db.user,
          "password"        : db.password,
          "database"        : db.database
        });
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
  }

module.exports = Database;