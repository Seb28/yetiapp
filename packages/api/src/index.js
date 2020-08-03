// FileName: index.js
// Import express
var express = require('express')
require('dotenv').config();

// Setup variables
var port = process.env.PORT || 8081;
var mongodb = process.env.MongoDB;

// Initialize the app
var fs = require('fs'),
http = require('http'),
app = express();
 
http.createServer(app);

app.use(express.static('public'));
app.use(express.json());

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

// var jwtCheck = jwt({
//       secret: jwks.expressJwtSecret({
//           cache: true,
//           rateLimit: true,
//           jwksRequestsPerMinute: 5,
//           jwksUri: 'https://yetiapp.eu.auth0.com/.well-known/jwks.json'
//     }),
//     audience: 'http://localhost',
//     issuer: 'https://yetiapp.eu.auth0.com/',
//     algorithms: ['RS256']
// });

// app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

// Import Body parser
let bodyParser = require('body-parser');
let cors = require('cors');
let helmet = require('helmet');
let morgan = require('morgan');
// Import Mongoose
let mongoose = require('mongoose');
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());
// adding Helmet to enhance your API's security
app.use(helmet());
// enabling CORS for all requests
app.use(cors());
// adding morgan to log HTTP requests
app.use(morgan('combined'));
// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
mongoose.set('useUnifiedTopology',  true );
mongoose.connect(mongodb, { useNewUrlParser: true});
var db = mongoose.connection;
// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")
// Import routes
let apiRoutes = require("./routes/api-routes")
// Use Api routes in the App
app.use('/api', apiRoutes)

// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running Yeti API on port " + port);
});
