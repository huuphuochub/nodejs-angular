var { render } = require('ejs');
var {authenticateToken} = require('./xacthuc.js');
var db = require('../module/database.js')
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
require('dotenv').config();
var ma = process.env.ma;var maxAge = 3600;

/* GET users listing. */
router.get('/', authenticateToken, function(req, res, next) {
  let sql = `SELECT * FROM product`;
  db.query(sql, (err, arr) =>{
    if(err) res.json({'thongbao' : `loi ${err}`});
    else res.json(arr)
  })

});
router.post('/check', authenticateToken, function(req,res,next){
  res.json({'thongbao' : true});
} )

module.exports = router;
