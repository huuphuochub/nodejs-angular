const express = require('express');
const path = require('path');
const app = express();

// Đường dẫn đến thư mục chứa hình ảnh trên máy chủ
const imageDirectory = path.join(__dirname, '..', 'public','images');

// Endpoint để phục vụ hình ảnh
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imageDirectory, imageName);
  
  // Gửi hình ảnh về cho trình duyệt
  res.sendFile(imagePath);
});

// Khởi động máy chủ
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = router;
