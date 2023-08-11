// cloud functionsのコピペ

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const fetch = require("node-fetch")
const { Pool } = require("pg");

var pass = 'tset-esabatad-database-test';

const pool = new Pool({
  user: 'postgres',
  host: 'db.ncddhgoemdbghyzcmvmg.supabase.co',
  database: 'postgres',
  password: pass,
  port: 5432,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false
  }
})

const sendSql = (sql) => {
  pool.query(`INSERT INTO country(name) VALUES ('${sql}')`)
}

const ran = Math.floor(Math.random() * 200);


      
exports.testfunc = () => {
  fetch(`https://jsonplaceholder.typicode.com/todos/${ran}`)
      .then(response => response.json())
      .then(json => sendSql(json.title))
};