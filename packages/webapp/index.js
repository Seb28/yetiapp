// FileName: index.js
// Import express
var express = require('express')
require('dotenv').config();
// Initialize the app
var app = express();
var http = require('http').Server(app);
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

// Setup server port
var port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', function (req, res) { 
    res.sendfile(__dirname + '/public/index.html'); 
});


// Import Body parser
let bodyParser = require('body-parser');
let cors = require('cors');
let morgan = require('morgan');
// enabling CORS for all requests
app.use(cors());
// adding morgan to log HTTP requests
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
    extended: true
 }));
 app.use(bodyParser.json());
// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running Yeti app on port " + port);
});
