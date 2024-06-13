var db = require('../module/database.js')
var express = require('express');
const uploadCloud = require('../module/cloud');

var router = express.Router();

router.get('/', function(req, res, next) {
    let sql = `SELECT * FROM product `;
    // console.log(req.body.token);
    db.query(sql, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  });
  router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    let sql = `SELECT * FROM product WHERE id_product = ?`;
    db.query(sql, id, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  });
  router.get('/laysao/:id', function(req, res, next) {
    const id = req.params.id;
    let sql = `SELECT * FROM coment WHERE id_product = ?`;
    db.query(sql, id, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  });
  router.get('/user/:id', function(req, res, next) {
    const id = req.params.id;
    let sql = `SELECT * FROM user WHERE id_user = ?`;
    db.query(sql, id, (err, arr) =>{
      if(err) res.json({'thongbao' : `loi ${err}`});
      else res.json(arr)
    })
  });
  router.put('/:id', function(req,res,next){
    const id = req.params.id;
    let name = req.body.name;
    let price = req.body.price;
    let status = req.body.status;

    let product ={name:name, price:price,status:status}
let sql = 'UPDATE SET ? WHERE id_product = ?';
db.query(sql, [id, product],(err,arr) =>{
  if(err) res.json({'thongbao' : `loi ${err}`});
  else res.json
})
  })
  router.post('/', uploadCloud.single('file'), (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      console.log("k có file");
      // return;
    }
    console.log(req.body);

   const name = req.body.name;
   const id_category = req.body.category;
   const price = req.body.price;
   const promotional_price = req.body.promotional_price;
   const describes = req.body.describes;
   const quantity = req.body.quantity;
   const sold = req.body.sold;
   const id_user = req.body.id_user;
   const date = req.body.date;
   const status = req.body.status;
   const image = req.file.path 
   let sql = 'INSERT INTO product (id_user,id_category,name, image,describes,price,promotional_price,date,quantity,sold, status) VALUES (?, ?, ?,?,?,?,?,?,?,?,?)';
   db.query(sql, [id_user,id_category, name,image,describes,price,promotional_price,date,quantity,sold,status] ,(err,arr)=>{
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
    const id = req.body.id_product;
   const name = req.body.name;
   const id_category = req.body.category;
   const price = req.body.price;
   const promotional_price = req.body.promotional_price;
   const describes = req.body.describes;
   const quantity = req.body.quantity;
   const sold = req.body.sold;
   const id_user = req.body.id_user;
   const date = req.body.date;
   const status = req.body.status;
   let sql = 'UPDATE product SET id_user = ? , id_category = ?, name = ?, image =?,describes=?,price = ?,promotional_price=?, date = ?,quantity=?,sold = ?,   status = ? WHERE id_product = ?'; 
   db.query(sql, [id_user,id_category, name,image,describes,price,promotional_price,date,quantity,sold,status, id] ,(err,arr)=>{ 
    if(err) res.send({'thongbao': `lỗi  ${err} + ${id_category}`});
    else return res.json(arr)
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

  router.delete('/:id', (req,res,next) =>{
    const id = req.params.id;
let sql = 'DELETE  FROM product WHERE id_product = ?';
db.query(sql,id,(err,arr)=>{
  if(err) res.send({'thông báo': `lỗi ${err}`});
    else return res.json({'thongbao':'xóa thành công'})
})
  })
  
router.get('/productbyuser/:id' ,(req,res,next)=>{
  const id_user = req.params.id;
  console.log(req.body);
  console.log(id_user);
  
  let sql =`SELECT * FROM product WHERE id_user = ?`
  db.query(sql, id_user,(err,arr)=>{
    res.json(arr);
  })
})


router.post('/addcoment', function(req, res, next){
  console.log(req.body.content);
})
router.post('/producttheomangid', function(req, res, next) {
  let arrid = req.body;

  // Kiểm tra nếu req.body là một mảng
  if (!Array.isArray(arrid)) {
      return res.status(400).json({ thongbao: false, error: "Invalid input format. Expected an array." });
  }

  console.log(arrid);

  // Tạo một mảng các Promise để cập nhật cơ sở dữ liệu
  let updatePromises = arrid.map(element => {
      return new Promise((resolve, reject) => {
          let sql = 'SELECT * FROM product WHERE id_product = ?';
          db.query(sql, element.id, (err, result) => {
              if (err) {
                  return reject(err);
              }
              resolve(result);
          });
      });
  });

  // Sử dụng Promise.all để chờ tất cả các Promise hoàn thành
  Promise.all(updatePromises)
      .then(results => {
          res.json({ thongbao: true, data: results });
      })
      .catch(err => {
          res.status(500).json({ thongbao: false, error: err });
      });
});


  
  module.exports = router;
