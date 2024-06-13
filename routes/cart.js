const { promises } = require('nodemailer/lib/xoauth2/index.js');
var db = require('../module/database.js')
var express = require('express');
const moment = require('moment-timezone');

var router = express.Router();


/* GET home page. */
router.post('/', function(req, res, next) {
//  console.log(req.body);
 let id_user = req.body.id_user;
 let sql = "SELECT * FROM orders WHERE id_user = ? AND pay = 0";
 db.query(sql, id_user , (err, arr)=>{
    res.json( arr);
 })
});





router.get('/', function(req, res, next) {
    
    let sql = "SELECT * FROM orders WHERE pay =1";
    db.query(sql , (err, arr)=>{
       res.json( arr);
    })
   });
router.post('/add', function(req, res, next) {
    let id_user = req.body.id_user;
    let id_product = req.body.id_product;
    let quantity = req.body.quantity;
    let pay = req.body.pay;
    let total_amount = req.body.total_amount;
    let date = req.body.date;
    let formattedDate = moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

    console.log(formattedDate);
    let id_seller = req.body.id_seller;
    console.log(req.body);
    let sql = 'INSERT INTO orders (id_user,id_product,quantity, pay,total_amount,date, id_seller) VALUES (?, ?, ?,?,?,?,?)';
    db.query(sql, [id_user,id_product,quantity, pay,total_amount,formattedDate, id_seller], (err, arr)=>{
        res.json({thongbao: true});
    })
});



router.get('/cartbytwoweek/:id', function(req, res, next) {
    const id_seller = req.params.id;
    
    // Lấy thời gian hiện tại và thời gian của 14 ngày trước ở dạng UTC
    let currentTime = moment.utc(); // Thời gian hiện tại
    let fourteenDaysAgo = currentTime.clone().subtract(14, 'days'); // 14 ngày trước
    let dates = new Date()
    let formattedDate = moment(dates).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    // let datetowek = new Date()
    // let formattedDates = moment(datetowek).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');

    let twoWeeksAgo = fourteenDaysAgo.format('YYYY-MM-DD HH:mm:ss'); // Định dạng thời gian 14 ngày trước
console.log(formattedDate);
    console.log(id_seller);
    let sql = 'SELECT * FROM orders WHERE date BETWEEN ? AND ? AND id_seller = ?';
    db.query(sql, [twoWeeksAgo, formattedDate, id_seller], (err, arr) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // console.log(arr);
        res.json(arr);
    });
});







router.get('/cartbyuser/:id', function(req, res, next) {
    const id_seller = req.params.id;
    // console.log(req.body)
//    console.log(id_seller);
    let sql = 'SELECT * FROM orders WHERE id_seller = ?';
    db.query(sql,  id_seller, (err, arr)=>{
       if(err) res.json(err);
        res.json(arr);
    })
});


router.post('/testthu', function(req,res,next){
    let arrid = req.body;
    console.log(arrid);
    let updateprosime = arrid.map(element =>{
        return new Promise((resolve,reject) =>{
            let sql = 'SELECT product.id_product, product.quantity FROM product JOIN orders ON product.id_product = orders.id_product WHERE id_orders = ?'
            db.query(sql, [element.id ] ,(err, arr)=>{
                if(err){
                    return reject({'lỗi 1 ' : err})
                }
                resolve(arr)
                // UPDATE product.quantity  = product.quantity - 1 AND orders.pay = 1 FROM product AND FROM orders ON product.id_product = orders.id_product WHERE id_orders = ?
            })
        })
    })
    Promise.all(updateprosime)
    .then(arrr =>{
        res.json(arrr)
    })
    .catch(err =>{
        res.json({'lỗi 2 ' : err});
    })
})




router.post('/thanhtoan', function(req, res, next) {
    let arrid = req.body;

    // Tạo một mảng các Promise để cập nhật cơ sở dữ liệu
    let updatePromises = arrid.map(element => {
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE orders SET pay = ? WHERE id_orders = ?'; 
            db.query(sql, [1, element.id], (err, result) => {
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
            res.json({ thongbao: true });
        })
        .catch(err => {
            res.status(500).json({ thongbao: false, error: err });
        });
});
router.delete('/:id', (req,res,next) =>{
    const id = req.params.id;
let sql = 'DELETE  FROM orders WHERE id_orders = ?';
db.query(sql,id,(err,arr)=>{
  if(err) res.send({'thông báo': `lỗi ${err}`});
    else return res.json({'thongbao':'xóa thành công'})
})
  })
  module.exports = router;
