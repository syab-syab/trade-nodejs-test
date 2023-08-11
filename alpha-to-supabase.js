'use strict';
var request = require('request');

const key = "XXX"
// ↓のurlで五ヶ月くらい遡れる
var url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=USD&apikey=${key}`;

// [TODO] {"USD": {"today": XXX, "yesterday": XXX, "last_week": XXX, "last_month": XXX}}
//           という感じの辞書配列にした方がこのAPIに合っている気がする
//           指定したレートが一年分くらい一度に表示されるから
//           その方がアクセス数を減らすことができる
//           あと、requestsにタイムアウトの時間を指定したりエラー処理を書いたりしてAPIにアクセスできなかった時の対策をする

// 取得した値がparseFloatしたのにNumber型のままなのは後回し

let rates = {
  "USD": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "EUR": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "GBP": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "CHF": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "AUD": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "NZD": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "NOK": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "CAD": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "INR": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "IDR": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "MYR": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "SGD": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "HKD": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "PHP": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "THB": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "KRW": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
  "CNY": [
    {
      "today": 0,
      "yesterday": 0,
      "last_week": 0,
      "last_month": 0
    }
  ],
}

// 念のためのコード
let code = [
  {"id": 1, "value": "USD", "name": "USD(アメリカ)"},
  {"id": 2, "value": "EUR", "name": "EUR(ヨーロッパ)"},
  {"id": 3, "value": "GBP", "name": "GBP(イギリス)"},
  {"id": 4, "value": "CHF", "name": "CHF(スイス)"},
  {"id": 5, "value": "AUD", "name": "AUD(オーストラリア)"},
  {"id": 6, "value": "NZD", "name": "NZD(ニュージーランド)"},
  {"id": 7, "value": "NOK", "name": "NOK(ノルウェー)"},
  {"id": 8, "value": "CAD", "name": "CAD(カナダ)"},
  {"id": 9, "value": "INR", "name": "INR(インド)"},
  {"id": 10, "value": "IDR", "name": "IDR(インドネシア)"},
  {"id": 11, "value": "MYR", "name": "MYR(マレーシア)"},
  {"id": 12, "value": "SGD", "name": "SGD(シンガポール)"},
  {"id": 13, "value": "HKD", "name": "HKD(香港)"},
  {"id": 14, "value": "PHP", "name": "PHP(フィリピン)"},
  {"id": 15, "value": "THB", "name": "THB(タイ)"},
  {"id": 16, "value": "KRW", "name": "KRW(韓国)"},
  {"id": 17, "value": "CNY", "name": "CNY(中国)"}
]

// アクセスの間隔は3～5秒

// 週と月のレートは平均ではなく中央値が良さげ
// 途中で平均値に変えたくなるかもしれないからいつでも変られるように

// forで回すなら
// today = 0
// yesterday = 1
// last-week = 1, 2, 3, 4, 5, 6, 7 の中央値
// last-months = 1 ～ 30 までの中央値

// ここから下をforとかで回す
// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       const originData = data['Time Series FX (Daily)']
      // \データから直接キーを取ることでわざわざ自前で日付を取得する必要無し
      // \不要になったが念のためコメントアウトして残しておく
      // \const dataKeys = Object.keys(originData)
      // \値を取得できるから日付を指定する必要無し
      // \それぞれの['4. close']をしていする
      // const dataValues = Object.values(originData)
      // \for文等で回すのはここ

//       console.log(dataValues);
//     }
// });