var db = require('../module/database.js')
var express = require('express');
const uploadCloud = require('../module/cloud');
const moment = require('moment-timezone');

var router = express.Router();


router.post('/addreplycoment', uploadCloud.none(), function(req, res, next){
  let id_user = req.body.id_user;
  let id_coment = req.body.id_coment;
  let content = req.body.content;
  let date = req.body.date;
  console.log(req.body.content);

  let sql = `INSERT INTO replaycoment (id_user_replay, id_coment, content, date) VALUES (?,?,?,?)`
db.query(sql, [id_user,id_coment,content,date], (err,arr) =>{
  if(err) {res.json({thongbao:err})}
    else{
  res.json({thongbao:true});
    }
})

})

router.post('/addcoment', uploadCloud.single('file'), function(req, res, next){
    let image;
    if (!req.file) {
      // console.log("k có file");
      // console.log(req.body.file);
      image = req.body.file;
    }else{
    
    image = req.file.path 
    }
    const content = req.body.content;
    const id_user = req.body.id_user;
    const id_product = req.body.id_product;
    const star = req.body.star;
    let date = req.body.date;
    let formattedDate = moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

    let sql = `INSERT INTO coment (id_user, id_product, content, star, image, date ) VALUES (?,?,?,?,?,?) `;
    db.query(sql, [id_user, id_product, content, star,image, formattedDate ], (err,arr) =>{
        if(err){
            res.json({thongbao : "lỗi"})
        }
        res.json({thongbao: true});
    })
  //  console.log(req.body.content);
})

router.post('/layallcoments', uploadCloud.none(), function(req, res, next) {
  const id = req.body.id_product;
  // console.log(req.body);

  let page = req.body.page;
  if (page == 1) {
      page = 0;
  } else {
      page = (page - 1) * 10;
  }

  let sql = `SELECT * FROM coment WHERE id_product = ? ORDER BY date DESC LIMIT 10 OFFSET ?`;
  db.query(sql, [id, page], (err, arr) => {
      if (err) res.json({'thongbao': `loi ${err}`});
      else res.json(arr);
  });
});
router.get('/layallcoment/:id', function(req, res, next) {
  const id = req.params.id;



  let sql = `SELECT * FROM coment WHERE id_product = ?`;
  db.query(sql, id, (err, arr) => {
      if (err) res.json({'thongbao': `loi ${err}`});
      else res.json(arr);
  });
});


router.get('/layreplay/:id', function(req, res, next) {
  const id = req.params.id;



  let sql = `SELECT * FROM replaycoment WHERE id_coment = ?`;
  db.query(sql, id, (err, arr) => {
      if (err) res.json({'thongbao': `loi ${err}`});
      else res.json(arr);
  });
});


router.delete('/:id', (req,res,next) =>{
  const id = req.params.id;
let sql = 'DELETE  FROM coment WHERE id = ?';
db.query(sql,id,(err,arr)=>{
if(err) res.send({'thông báo': `lỗi ${err}`});
  else return res.json({'thongbao':'xóa thành công'})
})
})
router.delete('/reply/:id', (req,res,next) =>{
  const id = req.params.id;
let sql = 'DELETE  FROM replaycoment WHERE id_replaycoment = ?';
db.query(sql,id,(err,arr)=>{
if(err) res.send({'thông báo': `lỗi ${err}`});
  else return res.json({'thongbao':'xóa thành công'})
})
})


router.post('/like', uploadCloud.none(), function(req, res, next) {
const id_user = req.body.id_user;
const id_coment=req.body.id_coment;

let sql =`INSERT INTO likecoment ( id_user,id_coment, status) VALUES (?,?,?)`;
db.query(sql, [id_user,id_coment,1], (err,arr)=>{
  res.json({thongbao:true});
})

})

router.post('/huylike', uploadCloud.none(), function(req, res, next) {
  const id_likecoment=req.body.id_likecoment;
  // console.log(id_likecoment);
  
  let sql =`DELETE  FROM likecoment WHERE id_likecoment = ?`;
  db.query(sql, id_likecoment, (err,arr)=>{
    res.json({thongbao:true});
  })
  
  })
  router.post('/huydislike', uploadCloud.none(), function(req, res, next) {
    const id_likecoment=req.body.id_dislikecoment;
    // console.log(id_likecoment);
    
    let sql =`DELETE  FROM likecoment WHERE id_likecoment = ?`;
    db.query(sql, id_likecoment, (err,arr)=>{
      res.json({thongbao:true});
    })
    
    })

router.post('/dislike', uploadCloud.none(), function(req, res, next) {
  const id_user = req.body.id_user;
  const id_coment=req.body.id_coment;
  
  let sql =`INSERT INTO likecoment ( id_user,id_coment, status) VALUES (?,?,?)`;
  db.query(sql, [id_user,id_coment,2], (err,arr)=>{
    res.json({thongbao:true});
  })
  
  })

  router.post('/layalllikecmt', function(req, res, next) {
    let arrid = req.body;
    // console.log(arrid);

    // Kiểm tra nếu req.body là một mảng
    if (!Array.isArray(arrid)) {
        return res.status(400).json({ thongbao: false, error: "Invalid input format. Expected an array." });
    }
  
    // console.log(arrid);
  
    // Tạo một mảng các Promise để cập nhật cơ sở dữ liệu
    let updatePromises = arrid.map(element => {
      // console.log(element.id);
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM likecoment WHERE id_coment = ?';
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

  

  router.post('/layallreplay', function(req, res, next) {
    let arrid = req.body;
  
    // Kiểm tra nếu req.body là một mảng
    if (!Array.isArray(arrid)) {
        return res.status(400).json({ thongbao: false, error: "Invalid input format. Expected an array." });
    }
  
    // console.log(arrid);
  
    // Tạo một mảng các Promise để cập nhật cơ sở dữ liệu
    let updatePromises = arrid.map(element => {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM replaycoment WHERE id_coment = ?';
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
