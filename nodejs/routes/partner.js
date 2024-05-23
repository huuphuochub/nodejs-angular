var { render } = require('ejs');
var {authenticateToken} = require('./xacthuc.js');
var db = require('../module/database.js')
var express = require('express');
var nodemailer = require('nodemailer');
var {OAuth2Client} = require('google-auth-library');
var router = express.Router();
var jwt = require('jsonwebtoken');
var ma = 'phuocdtr';
var maxAge = 3600;
const saltRounds = 10;
const bcrypt = require("bcrypt");
require('dotenv').config();


const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})
var maotp;

function taoma(){
  maotp = Math.floor(100000 + Math.random() * 900000);
}



//************************************************* */
router.post('/checkma', function(req,res, next){
  var ma = req.body.otp;
  console.log(ma, maotp);
  if(maotp == ma){
    res.json({ketqua : true})
  }
  else{
    res.json({ketqua : false});
  }
})





//**************************************************** */
router.post('/xacthuc', async(req,res) =>{
let email =req.body.email;
console.log(req.body.email);
taoma();

console.log(email, maotp)
try{
  
    if (!email) throw new Error('Please provide email, subject and content!')
    /**
     * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
     * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
     */
    const myAccessTokenObject = await myOAuth2Client.getAccessToken()
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token
    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken
      }
    })
    // mailOption là những thông tin gửi từ phía client lên thông qua API
    const mailOptions = {
      to: email, // Gửi đến ai?
      subject: `mã xác thực`, // Tiêu đề email
      html: `<h3>${maotp}</h3>` // Nội dung email
    }
    // Gọi hành động gửi email
    await transport.sendMail(mailOptions)
    // Không có lỗi gì thì trả về success
    res.status(200).json({ message: 'Email sent successfully.' })

}catch(err){
  console.log(err)
  res.status(500).json({ errors: err })
}
})

//***************************************** */


router.get('/',authenticateToken, function(req,res, next){
  let sql = `SELECT * FROM product WHERE id_user = ?`;
  let user = req.user;
  let id_user = user.id;
  console.log(user);
  db.query(sql, id_user, (err, arr) =>{
    if(err) res.json({'loi': `${err}`});
    else{res.json(arr)};
  })
})

//-**************************************************
router.post('/login', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let sql = `SELECT * FROM user WHERE name = ?`;

  db.query(sql, username, (err, arr) => {
    if (err) {
      res.status(500).json({ 'thongbao': `Lỗi: ${err}` });
    } else {
      if (arr.length === 0) {
        // Tên đăng nhập không tồn tại trong cơ sở dữ liệu
        res.status(401).json({ 'thongbao': 'Tên đăng nhập không đúng' });
      } else {
        bcrypt.compare(password, arr[0].password)
          .then(match => {
            if (match && arr[0].role == 1) {
              const token = jwt.sign(
                { id: arr[0].id_user, name: username, email: arr[0].email, role: arr[0].role },
                ma, // Key của bạn ở đây
                { expiresIn: maxAge } // Thời gian hết hạn của token
              );
              res.header('Authorization', 'Bearer ' + token);
              res.status(200).json({ 'thongbao': true });
            } else if (!match) {
              // Mật khẩu không đúng
              res.status(401).json({ 'thongbao': 'Mật khẩu không đúng' });
            } else if (match && arr[0].role != 1) {
              res.status(403).json({ 'thongbao': 'Tài khoản của bạn chưa được phê duyệt để bán hàng' });
            }
          })
          .catch(error => {
            res.status(500).json({ 'thongbao': `Lỗi: ${error}` });
          });
      }
    }
  });
});
/* GET users listing. **********************************/



router.post('/sign',  function(req, res, next) {
  const username = req.body.name;
  const email = req.body.email;
  const address = req.body.address;
  const id_from = req.body.informaton;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds,(err, hash) => {
    if(err){
      console.log('lỗi mã hóa');
    }
  let role = 1;
  // console.log(hash);
  let date = new Date();
  let sql = `INSERT INTO user SET ?`;
  let full_user = {name:username, email:email, password:hash, date:date , role:role, information:id_from, address:address};
  db.query(sql, full_user, (err, arr) =>{
    console.log('sql đây nè' + sql);
    if(err) res.json({'thongbao' : `loi ${err}`});
    else {res.json({'thongbao' : true})}
  })
})
});

// ******************************
router.post('/checkusers', function(req,res) {
  const username = req.body.name;
  const email = req.body.email;
  
  console.log(username, email);
  let sql = `SELECT * FROM user WHERE name = ? OR email = ?`;
  db.query(sql,[username, email], (err, arr)=>{
    console.log(arr)
    if (err) {
      console.error('Lỗi truy vấn:', err);
      res.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
      return;
    }
    console.log(arr);
    if(arr.length>0){
      console.log(arr);
      let loi ;
    for(let i = 0; i < arr.length; i++){
      const row = arr[i];
      if (row.name === username) {
        loi = 'tên tk đã tồn tại';
        break;
      }else if(row.email === email) {
        loi = 'email đã tồn tại';
        break;
      }
    }
    console.log(loi);
     res.json({exists: `${loi}`})

    }else {
      res.json({exists: false});
    }
  } )
})

router.post('/checkparmy', function(req,res, nexx){
  const name = req.body.name;
  const email = req.body.email;

  if(!email || !name){
    res.json({thongbao:'khong nhan dc name hoac email'})
  }
  console.log(name, email);
  let sql = `SELECT * FROM user WHERE name = ?`;
  db.query(sql, name, (err, arr)=>{
    if(err){
      res.json({thongbao : 'ten tai khoan khong ton tai'});
      return next(err);

    }else{
      console.log(arr, email)
      if(arr.length>0){ 
        if(email !== arr[0].email){
          res.json({thongbao : 'email khong dung voi tai khoan da dang ki'});
        }else{
          res.json({thongbao : true});
        }
      }else{
        res.json({thongbao : 'ten tai khoan khong ton tai'});
      }
    }
  })
})
router.put('/edituser', function(req,res,next){
  const password = req.body.password;
  const username = req.body.name;
  bcrypt.hash(password, saltRounds,(err, hash) => {

  let sql = 'UPDATE user SET password = ? WHERE name = ?';
  db.query(sql, [hash, username], (err, arr)=>{
    res.json({thongbao: true});
  })

  })

})
module.exports = router;
