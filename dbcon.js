var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_shermado',
  password        : 'Dovisthecoolest1',
  database        : 'cs340_shermado'
});
module.exports.pool = pool