'use strict';
var request = require('request');


const pass = "AW5GBJKBXYGBTST3"
// ↓のurlで五ヶ月くらい遡れる
// dailyだと土日のデータが無い
// `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=USD&apikey=AW5GBJKBXYGBTST3`;

// w
// `https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=JPY&to_symbol=USD&apikey=AW5GBJKBXYGBTST3`
// `https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=JPY&to_symbol=USD&apikey=AW5GBJKBXYGBTST3`

// [TODO] {"USD": {"today": XXX, "yesterday": XXX, "last_week": XXX, "last_month": XXX}}
//           という感じの辞書配列にした方がこのAPIに合っている気がする
//           指定したレートが一年分くらい一度に表示されるから
//           その方がアクセス数を減らすことができる
//           あと、requestsにタイムアウトの時間を指定したりエラー処理を書いたりしてAPIにアクセスできなかった時の対策をする

// 取得した値がparseFloatしたのにNumber型のままなのは後回し

// JPY / XX のレート
let foreignRates = {
  "USD": 0,
  "EUR": 0,
  "GBP": 0,
  "CHF": 0,
  "AUD": 0,
  "NZD": 0,
  "NOK": 0,
  "CAD": 0,
  "INR": 0,
  "IDR": 0,
  "MYR": 0,
  "SGD": 0,
  "HKD": 0,
  "PHP": 0,
  "THB": 0,
  "KRW": 0,
  "CNY": 0,
}

// XX / JPY のレート
let jpyRates = {
  "USD": 0,
  "EUR": 0,
  "GBP": 0,
  "CHF": 0,
  "AUD": 0,
  "NZD": 0,
  "NOK": 0,
  "CAD": 0,
  "INR": 0,
  "IDR": 0,
  "MYR": 0,
  "SGD": 0,
  "HKD": 0,
  "PHP": 0,
  "THB": 0,
  "KRW": 0,
  "CNY": 0,
}

// pythonで言うところのsleep
// 引数はミリ秒(1000 = 1秒)
const sleep = (waitTime)=>{
  const startTime = Date.now();
  while( Date.now() - startTime < waitTime );
};

// アクセスの間隔は3～5秒

// データベースには当日分のレートしか格納できないようになってしまった



// ex)...
// let foreignRates = {
//   "USD": 0,
//   "EUR": 0,
//   ........
// }

// デイリーのapiにアクセスすると当日から五ヶ月ほど前のレートが取れるから
// そのレートをまるごと文字列として取得してデータベースにぶち込む
// React.jsで取り出すときにJSON.parseで行けると思う

// ひな型完成
const fetchRates = (rates) => {
  // 渡されたオブジェクトからキー(通貨コード)を取得 -> 配列にする
  Object.keys(rates).forEach((key) => {
    // ここでurlを定義
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=${key}&apikey=${pass}`
    console.log(url)
    console.log(key + " : " + rates[key])
    sleep(3000)
    })
  }

// fetchRates(foreignRates)

// ここから下をforとかで回す
request.get({
    url: "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=USD&apikey=AW5GBJKBXYGBTST3",
    // url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // まずデイリーのレートを取得
      const originData = data['Time Series FX (Daily)']
      console.log(originData)
      // データベース格納用に文字列変換 → する必要ないかも
      // const stringData = JSON.stringify(originData)
      // 文字列化したjsonを戻す
      // const jsonData = JSON.parse(stringData)
      // console.log(jsonData['2023-08-11'])

    }
});


// データベースへの処理
// オブジェクトにレートを格納し終えてから最後に行う

// データベースへの接続に必要なライブラリ
// const fetch = require("node-fetch")
// const { Pool } = require("pg")


// データベースへの接続に必要なパス
// var dbpass = 'XXX';

// データベースへの接続に必要な情報
// const pool = new Pool({
//   user: 'XXX',
//   host: 'XXX',
//   database: 'XXX',
//   password: dbpass,
//   port: 5432,
//   ssl: {
//     sslmode: 'require',
//     rejectUnauthorized: false
//   }
// })



// value = レートの値(float)
// date = その日の日付(string)
// baseCode = デフォルト値はJPY(string)
// payCode = 換算される外国の通貨コード(string)
// period = 対象期間(string)
// 当日のレートしか入れないから後でsql分を変えておく
const sendSql = (value, date, payCode, baseCode='JPY',) => {
  // pool.query(`UPDATE rate SET rate_val=${value}, updated='${updated_val}' WHERE base_code='${baseCode}' AND payment_code='${payCode}' AND rate_period='${period}'`)
  console.log(`UPDATE rate SET rate_val=${value}, updated='${date}' WHERE base_code='${baseCode}' AND payment_code='${payCode}' AND rate_period='today'`)
}

// この関数で締める
const dbWrite = (rates) => {
    // 渡されたオブジェクトからキー(通貨コード)を取得 -> 配列にする
    Object.keys(rates).forEach((key) => {


      const value = rates[key]
      const today_stamp = new Date()
      const date = [today_stamp.getFullYear(), today_stamp.getMonth() + 1, today_stamp.getDate()].join('-')
      const payCode = key
      sendSql(value, date, payCode)
    })
}

// 
// dbWrite(foreignRates)