require('dotenv').config();
var ma = process.env.ma;
var jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
// Lấy token từ header trong trình duyệt
var token = req.body.token;
    if (!token) { 
        return res.json({ thongbao: 'k có token' }); 
    }
    console.log(token)
    token = token.split(' ')[1];
    jwt.verify(token, ma, (err, user) => {
        console.log(user);
        if (err) {
            return res.json({ thongbao: 'Token không hợp lệ.' });
        }
        console.log(user.role);
        if(user.role !==1){
            return res.json({thongbao:"bạn k phải admin để vào"})
        }else {
            req.user = user;
            next();       
         }
        
       
    });
};