const express = require('express');
const router = express.Router();
const uploadCloud = require('../module/cloud');

router.post('/', uploadCloud.single('file'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    console.log("k có file");
    // return;
  }
 const name = req.body.name;
 const price = req.body.price;
 let obj={name:name, price:price,hinh:req.file.path  }
 res.json({"dữ liệu" : obj});
});

module.exports = router;
