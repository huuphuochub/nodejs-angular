const { render } = require('ejs');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const {authenticateToken} = require('./xacthuc.js');
var db = require('../module/database.js')
var express = require('express');
var jwt = require('jsonwebtoken');
var ma = process.env.ma;
var maxAge = 360000;
var router = express.Router();


/* GET users listing. */
router.get('/',authenticateToken, function(req, res, next) {
  let sql = `SELECT * FROM user`;
  db.query(sql, (err, arr) =>{
    if(err) res.json({'loi': `${err}`});
    else{res.json(arr)};
  })
});
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  console.log(id)
  let sql = `SELECT * FROM user WHERE id_user = ?`;
  db.query(sql, id,  (err, arr) =>{
    if(err) res.json({'loi': `${err}`});
    else{res.json(arr)};
  })
});
router.post('/dangki', function(req,res, next){
let username = req.body.username;
let password = req.body.password;
bcrypt.hash(password, saltRounds,(err, hash) => {

let role = 0;
let date = new Date();
let sql = `INSERT INTO user SET ?`;
let full_user = {name:username,  password:hash,  date:date , role:role};
db.query(sql, full_user, (err, arr) =>{
  if(err) res.json({'thongbao' : `loi ${err}`});
  else {res.json(arr)}
})
})
});
router.post('/login', function(req, res, next) {
  
  console.log(req.body);
  const username = req.body.name;
  const password = req.body.password;
  console.log(username, password);
  let sql = `SELECT * FROM user WHERE name = ?`;

  db.query(sql, username, (err, arr) => {
    console.log(sql)
      if (err) {
          res.json({ 'thongbao': `Lỗi: ${err}` });
      } else {
          if (arr.length === 0) {
              // Tên đăng nhập không tồn tại trong cơ sở dữ liệu
              res.json({ 'thongbao': 'Tên đăng nhập không đúng' });
          } else {
          bcrypt.compare(password, arr[0].password)
          .then(match => {
            if (match) {
              console.log(arr);
              const token = jwt.sign(
                  { id: arr[0].id_user, name: username, email: arr[0].email, role: arr[0].role },
                  ma,
                  { expiresIn: maxAge }
              );
              res.header('Authorization', 'Bearer ' + token);
              res.json({ 'thongbao': true , id_user:arr[0].id_user,name:arr[0].name, token:token});
          } else {
              // Mật khẩu không đúng
              res.json({ 'thongbao': 'Mật khẩu không đúng' });
          }
          })
          .catch(error => {
            res.status(500).json({ 'thongbao': `Lỗi: ${error}` });
          });


              
          }
          
      }
  });
});



router.post('/checkusers', function(req,res) {
  const username = req.body.username;
  
  let sql = `SELECT * FROM user WHERE name = ? `;
  db.query(sql,username, (err, arr)=>{
    if (err) {
      console.error('Lỗi truy vấn:', err);
      res.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
      return;
    }
    console.log(arr);
    if(arr.length>0){
      res.json({exists : `tên tài khoản đã tồn tại`})

    }else {
      res.json({exists: false});
    }
  } )
})
module.exports = router;
