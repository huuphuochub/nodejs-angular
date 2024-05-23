var db = require('../module/database.js')
var express = require('express');
const uploadCloud = require('../module/cloud');

var router = express.Router();

router.get('/', function(req, res, next) {
    let sql = `SELECT * FROM category`;
    db.query(sql, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  });
  router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    let sql = `SELECT * FROM product WHERE id_category = ?`;
    db.query(sql, id, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  });
  router.get('/detail/:id', function(req,res,next){
    const id = req.params.id;
    let sql = `SELECT * FROM category WHERE id = ?`;
    db.query(sql, id, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  })
  // router.post('/', function(req,res,next){
  //   let dulieu = req.body;
  //   console.log(dulieu);
  // })
  router.post('/', uploadCloud.single('file'), (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      console.log("k có file");
      // return;
    }
   const name = req.body.name;
   const status = req.body.status;
   const image = req.file.path 
   let sql = 'INSERT INTO category (name, image, status) VALUES (?, ?, ?)';
   db.query(sql, [name,image,status] ,(err,arr)=>{
    if(err) res.json({'thongbao': `lỗi ${err}`});
    else res.json(arr)
   })
  });
  router.put('/', uploadCloud.single('file'), (req, res, next) => {
    let image;
    if (!req.file) {
      console.log("k có file");
      console.log(req.body.file);
      image = req.body.file;
    }else{
    
    image = req.file.path 
    }
    const id = req.body.id;
   const name = req.body.name;
   const status = req.body.status;
   let sql = 'UPDATE category SET name = ?, image =?, status = ? WHERE id = ?'; 
   db.query(sql, [name,image,status, id] ,(err,arr)=>{ 
    if(err) res.send({'thongbao': `lỗi ${err}`});
    else return res.json(arr)
   })
  });
  router.delete('/:id', (req,res,next) =>{
    const id = req.params.id;
let sql = 'DELETE  FROM category WHERE id = ?';
db.query(sql,id,(err,arr)=>{
  if(err) res.send({'thông báo': `lỗi ${err}`});
    else return res.json({'thongbao':'xóa thành công'})
})
  })
  
  module.exports = router;
