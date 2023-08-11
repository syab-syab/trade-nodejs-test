'use strict';
var request = require('request');


const pass = "AW5GBJKBXYGBTST3"
// ↓のurlで五ヶ月くらい遡れる
// var url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=USD&apikey=${pass}`;

// [TODO] {"USD": {"today": XXX, "yesterday": XXX, "last_week": XXX, "last_month": XXX}}
//           という感じの辞書配列にした方がこのAPIに合っている気がする
//           指定したレートが一年分くらい一度に表示されるから
//           その方がアクセス数を減らすことができる
//           あと、requestsにタイムアウトの時間を指定したりエラー処理を書いたりしてAPIにアクセスできなかった時の対策をする

// 取得した値がparseFloatしたのにNumber型のままなのは後回し

let foreignRates = {
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

// pythonで言うところのsleep
// 引数はミリ秒(1000 = 1秒)
const sleep = (waitTime)=>{
  const startTime = Date.now();
  while( Date.now() - startTime < waitTime );
};

// アクセスの間隔は3～5秒

// 週と月のレートは平均ではなく中央値が良さげ
// 途中で平均値に変えたくなるかもしれないからいつでも変られるように

// forで回すなら
// today = 0
// yesterday = 1
// last-week = 1, 2, 3, 4, 5, 6, 7 の中央値
// last-months = 1 ～ 30 までの中央値



// ex)...
// let foreignRates = {
//   "USD": [
//     {
//       "today": 0,
//       "yesterday": 0,
//       "last_week": 0,
//       "last_month": 0
//     }
//   ],
//   "EUR": [
//     {
//       "today": 0,
//       "yesterday": 0,
//       "last_week": 0,
//       "last_month": 0
//     }
//   ],
//   ........
// }

// ひな型完成
const fetchRates = (rates) => {
  // 渡されたオブジェクトからキー(通貨コード)を取得 -> 配列にする
  Object.keys(rates).forEach((key) => {
    // ここでurlを定義
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=${key}&apikey=${pass}`
    console.log(url)
    console.log(key + " : ")
    // 各通貨コード内のオブジェクトのキー(期間)を取得 -> 配列にする
    Object.keys(rates[key][0]).forEach((vk) => {
      // 各期間にレート値を代入
      // ex. rates["USD"][0]["today"] = 0.0069
      switch(vk) {
        case "today":
          const todayIndex = [0]
          console.log(todayIndex)
          rates[key][0][vk] = 0.01
          console.log(vk + " : " + rates[key][0][vk])
          break;
        case "yesterday":
          const yesterdayIndex = [1]
          console.log(yesterdayIndex)
          rates[key][0][vk] = 0.01
          console.log(vk + " : " + rates[key][0][vk])
          break;
        case "last_week":
          const lastWeekIndex = [1, 2, 3, 4, 5, 6, 7]
          console.log(lastWeekIndex)
          rates[key][0][vk] = 0.01
          console.log(vk + " : " + rates[key][0][vk])
          break;
        case "last_month":
          const lastMonthIndex = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30
          ]
          console.log(lastMonthIndex)
          rates[key][0][vk] = 0.01
          console.log(vk + " : " + rates[key][0][vk])
          break;
        default:
          console.log("error")
      }
      // rates[key][0][vk] = 0.01
      // console.log(vk + " : " + rates[key][0][vk])
    })
    sleep(3000)
  })
}

// fetchRates(foreignRates)

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
const sendSql = (value, date, baseCode='JPY', payCode, period) => {
  // pool.query(`UPDATE rate SET rate_val=${value}, updated='${updated_val}' WHERE base_code='${baseCode}' AND payment_code='${payCode}' AND rate_period='${period}'`)
  console.log(`UPDATE rate SET rate_val=${value}, updated='${date}' WHERE base_code='${baseCode}' AND payment_code='${payCode}' AND rate_period='${period}'`)
}

// この関数で締める
const dbWrite = (rates) => {
    // 渡されたオブジェクトからキー(通貨コード)を取得 -> 配列にする
    Object.keys(rates).forEach((key) => {
      const payCode = key
      console.log(payCode)
      // 各通貨コード内のオブジェクトのキー(期間)を取得 -> 配列にする
      Object.keys(rates[key][0]).forEach((vk) => {
        const period = vk
        // console.log(period)
        const value = rates[key][0][vk]
        // console.log(value)
        const today_stamp = new Date()
        const date = [today_stamp.getFullYear(), today_stamp.getMonth() + 1, today_stamp.getDate()].join('-')
        // console.log(date + " = " + typeof(date))
        sendSql(value, date, "JPY", payCode, period)
      })
    })
}

dbWrite(foreignRates)