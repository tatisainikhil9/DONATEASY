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


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hbmil.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   console.log('connection error : ', err);

//   const galleryCollection = client.db("givedb").collection("gallery");
//   const volunteerRequestCollection = client.db("givedb").collection("volunteerRequest");
//   const volunteersCollection = client.db("givedb").collection("volunteers");
//   const adminsCollection = client.db("givedb").collection("admins");
//   const donorsCollection = client.db("givedb").collection("donors");
//   const cashDonationCollection = client.db("givedb").collection("cashDonation");
//   const campaignDonationCollection = client.db("givedb").collection("campaignDonation");
//   const donationRequestCollection = client.db("givedb").collection("donationRequest");
//   const togPostCollection = client.db("givedb").collection("tog");

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
  
//   // Check Admin
//   app.get('/isAdmin', (req, res) => {
//     adminsCollection.find({ email: req.query.email })
//       .toArray((err, admins) => {
//         res.send(admins.length > 0)
//       })
//   })


//   // Check Donor
//   app.get('/isDonor', (req, res) => {
//     donorsCollection.find({ email: req.query.email })
//       .toArray((err, donor) => {
//         res.send(donor)
//       })
//   })



//   // Photo Gallery
//   app.get('/photo-gallery', (req, res) => {
//     galleryCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })

//   // Add Photo
//   app.post('/addPhoto', (req, res) => {
//     const newPhoto = req.body;
//     galleryCollection.insertOne(newPhoto)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })


//   // All Volunteer Request
//   app.get('/volunteer-requests', (req, res) => {
//     volunteerRequestCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })

//   // All Volunteers
//   app.get('/volunteers', (req, res) => {
//     volunteersCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })

//   // Check Volunteer
//   app.get('/isVolunteer', (req, res) => {
//     volunteersCollection.find({ email: req.query.email })
//       .toArray((err, volunteer) => {
//         res.send(volunteer)
//       })
//   })

//   // New Volunteer Request
//   app.post('/newVolunteerRequest', (req, res) => {
//     const newVolunteerReq = req.body;
//     volunteerRequestCollection.insertOne(newVolunteerReq)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })

//   // Add Volunteer
//   app.post('/addVolunteer', (req, res) => {
//     const newVolunteer = req.body;
//     volunteersCollection.insertOne(newVolunteer)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })

//   // Delete Volunteer Request
//   app.delete('/deleteVolunteerRequest/:id', (req, res) => {
//     volunteerRequestCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })

//   // Delete Volunteer
//   app.delete('/deleteVolunteer/:id', (req, res) => {
//     volunteersCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })


//   // Cash Donation
//   app.post('/addCashDonation', (req, res) => {
//     const newCashDonation = req.body;
//     cashDonationCollection.insertOne(newCashDonation)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })



//   // All Posts
//   app.get('/posts', (req, res) => {
//     togPostCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })


//   // Add New Post
//   app.post('/addPost', (req, res) => {
//     const newPost = req.body;
//     togPostCollection.insertOne(newPost)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })


//   // Donor Specific Data
//   app.get('/userSpecificData', (req, res) => {
//     togPostCollection.find({ donorEmail: req.query.email })
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })


//   // Delete Post
//   app.delete('/deletePost/:id', (req, res) => {
//     togPostCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })


//   // Donor Data
//   app.get('/getDonorData/:donorId', (req, res) => {
//     donorsCollection.find({ _id: ObjectId(req.params.donorId) })
//       .toArray((err, items) => {
//         res.send(items)
//       })
//   })



//   // Campaign Donation
//   app.post('/addCampaignDonation', (req, res) => {
//     const newCampaignDonation = req.body;
//     campaignDonationCollection.insertOne(newCampaignDonation)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })


//   // All Donation Requests
//   app.get('/donationRequest', (req, res) => {
//     donationRequestCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })


//   // User Specific Requests
//   app.get('/userSpecificRequests', (req, res) => {
//     donationRequestCollection.find({ email: req.query.email })
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })



//   // Add New Donation Request
//   app.post('/newDonationRequest', (req, res) => {
//     const newDonationRequest = req.body;
//     donationRequestCollection.insertOne(newDonationRequest)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })



//   // Delete Donation Request
//   app.delete('/deleteDonationRequest/:id', (req, res) => {
//     donationRequestCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })



//   // All Admins
//   app.get('/admins', (req, res) => {
//     adminsCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })

//   // Add Admin
//   app.post('/addAdmin', (req, res) => {
//     const newAdmin = req.body;
//     adminsCollection.insertOne(newAdmin)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })

//   // Delete Admin
//   app.delete('/deleteAdmin/:id', (req, res) => {
//     adminsCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })

//   // All Donors
//   app.get('/donors', (req, res) => {
//     donorsCollection.find()
//       .toArray((err, items) => {
//         res.send(items);
//       })
//   })

//   // Add Donor
//   app.post('/addDonor', (req, res) => {
//     const newDonor = req.body;
//     donorsCollection.insertOne(newDonor)
//       .then(result => {
//         res.send(result.insertedCount > 0);
//       })
//   })

//   // Delete Donor
//   app.delete('/deleteDonor/:id', (req, res) => {
//     donorsCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })

// })


app.listen(port, () => { });
