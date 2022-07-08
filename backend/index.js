const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'nodejs'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('services'));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

  app.post('/isUser', (req, res) => {
    // const { username, password } = req.body;
    let username = req.body.data.login_email;
    let password = req.body.data.login_password;
    console.log(username, password);

    if (username && password) {
      let sql = 'SELECT * FROM users WHERE email_id = ? AND password = ?';
      let query = db.query(sql, [username, password], (err, results, fields) => {
        console.log(results);
        if (results.length > 0) {
          console.log("user found");
          res.send({ name: results[0].name, email: results[0].email_id });
        } else {
          res.send('False');
        }
        res.end();
      });
    }
  })

  app.post('/addUser', (req, res) => {
    // const { username, password } = req.body;
    let name = req.body.data.name;
    let email = req.body.data.email;
    let password = req.body.data.password;
    let post = { name: name, email_id: email, password: password };
    let sql = 'SELECT * FROM users WHERE email_id = ? AND password = ?';
    let query = db.query(sql, [email, password], (err, results, fields) => {
      console.log(results);
      if (results.length > 0) {
        res.send("Already exists");
      }
      else {
        let sql = 'INSERT INTO users SET ?';
        let query = db.query(sql, post, (err, result) => {
          console.log(result);
          res.send("Success");
        });
      }
    });
  });

  app.get('/getCampaigns', (req, res) => {
    let sql = 'SELECT * FROM ngos WHERE approved = 1';
    let query = db.query(sql, (err, results) => {
      console.log(results);
      res.send(results);
    });
  });

  // app.get('/getAllTransactions', (req, res) => {
  //   let sql = 'SELECT * FROM transactions';
  //   let query = db.query(sql, (err, results) => {
  //     console.log(results);
  //     res.send(results);
  //   });
  // });

  app.get('/getAllTransactions', (req, res) => {
    let sql = 'SELECT t.id, amount, payment_method, u.name as "username", n.name as "ngoname", t.time FROM transactions as t, users as u, ngos as n WHERE t.user_id = u.id AND t.ngo_id = n.id';
    let query = db.query(sql, (err, results) => {
      console.log(results);
      res.send(results);
    });
  });

  app.get('/getTransactions', (req, res) => {
    let email = req.body.data.email;
    let sql = 'SELECT * from transactions where user_id in (SELECT id from users where email_id = ?)';
    let query = db.query(sql, [email],(err, results) => {
      console.log(results);
      res.send(results);
    });
  });

app.listen(port, () => { });
