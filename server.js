const express = require('express');
const bodyParser= require('body-parser');
const app = express();

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'mhirota',
    password : 'password',
    database : 'sampledb'
});

app.use(bodyParser.urlencoded({extended: true})) //bodyParser
app.set('view engine', 'ejs');

/*
var connection = mysql.createConnection({
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
    user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
    password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
    port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
    database : process.env.OPENSHIFT_APP_NAME
});
*/

connection.connect(function(err){
    if (err) {throw err;}
    console.log('DB connected!');
});

/*
// Database setup
connection.query('USE sampledb', function (err) {
    if (err) throw err;
    connection.query('CREATE TABLE IF NOT EXISTS jobpostings('
		     + 'job_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,'
		     + 'job_name VARCHAR(40) NOT NULL,'
		     + 'posted_date TIMESTAMP NOT NULL,'
		     + 'job_description VARCHAR(100) NOT NULL,'
		     + 'category VARCHAR(30) NOT NULL,'
		     + 'location VARCHAR(30) NOT NULL'
		     +  ')', function (err) {
			 if (err) throw err;
		     });
});
*/

app.get('/', function(req, res) {
    //res.sendFile(__dirname + '/views/index.html');
    connection.query('SELECT * FROM jobpostings', function(err, result, fields) {
    	if (err) throw err;
	console.log(JSON.stringify(result));
	//res.render('index.ejs', {postings: JSON.stringify(result)})
	res.render('index.ejs', {postings: result})
	//res.render('index.ejs', {postings: output});
    });
    //connection.end();
});

app.post('/job-postings', (req, res) => {
    //console.log(req.body);
    var result = req.body;
    var sql = 'INSERT INTO jobpostings VALUE ('
	+ "'" + result['job-name'] + "',"
	+ 'NOW(),'
	+ "'" + result['job-description'] + "',"
	+ "'" + result['category'] + ',' + "',"
    	+ "'" + result['location'] + ',' + "',"
    	+ 'NULL'
	+ ')';
    console.log(sql);
    connection.query(sql, function(err, result) {
	if (err) throw err;
	console.log('created');
    });
    res.redirect('/')
});

/*
  var sql = 'CREATE TABLE IF NOT EXISTS jobpostings('
  + 'job_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,'
  + 'job_name VARCHAR(40) NOT NULL,'
  + 'posted_date TIMESTAMP NOT NULL,'
  + 'job_description VARCHAR(100) NOT NULL,'
  + 'category VARCHAR(30) NOT NULL,'
  + 'location VARCHAR(30) NOT NULL'
  +  ')';
*/

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
