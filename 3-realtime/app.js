// サーバーサイドのJavaScript
const express = require('express');
const app = express();
const httpserver = require('http').Server(app);
const PORT = 3000;

app.use(express.static('public'));

httpserver.listen(PORT, () => {
  console.log(`ポート ${PORT} で待機中`);
});
