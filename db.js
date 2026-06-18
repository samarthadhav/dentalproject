var mysql=require('mysql2');
var util=require('util');

var conn=mysql.createConnection({
    host:"bst5y8zdqvkxuwulbnt6-mysql.services.clever-cloud.com",
    user:"ulecqmgooilav826",
    password:"xMGx0VbZaS4KMF0qEJ11",
    database:"bst5y8zdqvkxuwulbnt6"
})

var exe=util.promisify(conn.query).bind(conn);

module.exports=exe;
