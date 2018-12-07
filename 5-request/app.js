// サーバーサイドのJavaScript
// 大学外で動かす場合
//var request = require('request');

// 大学内で動かす場合
var request = require('request').defaults({'proxy':'http://cache.ccs.kogakuin.ac.jp:8080'})

var url = 'https://eastasia.api.cognitive.microsoft.com/text/analytics/v2.0/keyphrases';
var apikey = '14530781a31041ea86cd67638ccdb191';

// HTTP ヘッダー
var headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': apikey
};

// リクエストオプション
var options = {
  url: url,
  method: 'POST',
  headers: headers,
  json: {
    'documents' : [
      {
        'language': 'ja',
        'id': '1',
        'text': '多様な情報であふれる社会の中で快適に生活するには、情報技術（IT）が必要であり、あらゆる場面で情報学とその関連分野が重要となっています。情報学部では実際の問題解決を通して学ぶ授業形態（PBL）を積極的に取り入れ、幅広い能力を持った人材を育成します。'
      }
    ]
  }
};

// リクエストの実行
request(options, onResponse);

// 応答を処理するコールバック関数
function onResponse(error, response, body) {
  if (body) {
    console.log(body);
    console.log(body.documents[0].keyPhrases);
  }
  if (error) {
    console.log(error);
  }
}