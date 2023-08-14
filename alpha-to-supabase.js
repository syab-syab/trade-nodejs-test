// 'use strict';
// var request = require('request');
// var request = require('sync-request');
import fetch from "node-fetch"

// データベースへの処理
// オブジェクトにレートを格納し終えてから最後に行う

// データベースへの接続に必要なライブラリ
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
// JPY / XXX と XXX / JPY のレートを同じ関数にするか迷う
const sendSql = (value, date, payCode, baseCode) => {
  // pool.query(`UPDATE rate SET rate_val=${value}, updated='${date}' WHERE base_code='${baseCode}' AND payment_code='${payCode}'`)
  // console.log(`UPDATE rate SET rate_val=${value}, updated='${date}' WHERE base_code='${baseCode}' AND payment_code='${payCode}'`)
  // pool.query(`INSERT INTO rate(base_code, payment_code, rate_val, updated) VALUES ('${baseCode}', '${payCode}', ${value}, '${date}')`)
  console.log(`INSERT INTO rate(base_code, payment_code, rate_val, updated) VALUES ('${baseCode}', '${payCode}', ${value}, '${date}')`)
}

// この関数で締める
const dbWriteJpyOther = (rates, key) => {
  const value = rates[key]
  const today_stamp = new Date()
  const date = [today_stamp.getFullYear(), today_stamp.getMonth() + 1, today_stamp.getDate()].join('-')
  const payCode = key
  sendSql(value, date, payCode, 'JPY')
}



// apiのパス
const pass = "XXX"
// ↓のurlで五ヶ月くらい遡れる
// dailyだと土日のデータが無い
// `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=USD&apikey=XXX`;
// ↑のAPIから取ってきたデータをそのまま丸ごとぶち込む
// freeプランだと1分間に5回のアクセスが限界らしい

// 取得した値がparseFloatしたのにNumber型のままなのは後回し

// JPY / XXX のレート
// テストの時は USD 以外コメントアウト
let foreignRates = {
  "USD": 0,
  "EUR": 0,
  // "GBP": 0,
  // "CHF": 0,
  // "AUD": 0,
  // "NZD": 0,
  // "NOK": 0,
  // "CAD": 0,
  // "INR": 0,
  // "IDR": 0,
  // "MYR": 0,
  // "SGD": 0,
  // "HKD": 0,
  // "PHP": 0,
  // "THB": 0,
  // "KRW": 0,
  // "CNY": 0,
}

// XXX / JPY のレート
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

// この関数で代入まで行う
// apiにアクセスして値を取ってくる関数
// async関数内ではawaitを非同期処理にawaitを付ければ
// 他の関数は順番に実行されるっぽいから
// この中でsupabaseへの書き込みもやった方が良いかも
const requestApiData = async (apiUrl, arr , key) => {
  // const response = await fetch(apiUrl)
  const data = await fetch(apiUrl)
  const res = await data.json()
  console.log("fetch")
  // キーとオブジェクトを分けないと代入できなかった
  // データベースに格納する際に不具合が起きたら文字列に変える
  arr[key] = res['Time Series FX (Daily)']
  // console.log(foreignRatess)
  // ↓の関数をところどころ変更する必要アリ
  dbWriteJpyOther(arr, key)
}

// ひな型完成
// この関数は現時点ではJPY / XXX の値のみ
// 他の関数を作成するかどうか
const fetchRates = (rates) => {
  // 渡されたオブジェクトからキー(通貨コード)を取得 -> 配列にする
  Object.keys(rates).forEach((key) => {
    // ここでurlを定義
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=JPY&to_symbol=${key}&apikey=${pass}`

    // どうやってもurlから取ってきた値が代入できないので次回へ持ち越し
    // console.log(key)
    requestApiData(url, rates, key)

    sleep(3000)
    // console.log(rates)
    })
    console.log("fetchRates")
  }

fetchRates(foreignRates)



