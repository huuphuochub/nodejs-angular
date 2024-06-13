var db = require('../module/database.js')
var express = require('express');


var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  let sql = `SELECT * FROM product`;
  db.query(sql, (err, arr) =>{
    if(err) res.json({'thongbao' : `loi ${err}`});
    else res.json(arr)
  })
});
// router.get('/', function(req, res, next) {
//  res.render("index");
// });

module.exports = router;
