var mysql = require('mysql'); 
var db = mysql.createConnection({   
    host: 'localhost', user: 'root', password: '', port:8888,    
    database: 'tmdt',
    multipleStatements:true 
});  
db.connect(function(err) {    
   if (err) throw err;    
   console.log('Da ket noi database'); 
}); 
module.exports = db;