/**
 * Module dependencies.
 */

var express = require('express'),
    https    = require('https'),
    fs      = require('fs'),
    mysql		= require('mysql'),
    routes  = require('./routes'),
    path    = require('path'),
    user    = require('./routes/user');

//global variables:	
var aesKey			= 'c!A=wq(0c&yw@3w',
	databaseName	= 'echodb',
	eventsTable		= 'events',
	eventName			= 'evento',
	eventId				= '0000000001',
	prePartakersTable = 'prePartakers' + eventId,
	partakersTable 		= 'partakers' + eventId,
	echosTable				= 'echos'	+ eventId,
	messagesTable 		= 'messages' + eventId;

var httpsStuff = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;   // development. 
//app.locals.pretty = false;  // production.
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function databaseInstance(){
  var connection = mysql.createConnection({
    host     : 'localhost',
    password : '',
    user     : 'root'
  });
  return connection;
}

function login(req, res, next){
	if(req.session.user){
		next();
		}else{
    res.redirect('/');
  }
}

//GET pages
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/organiserPanel', login, routes.organiserPanel);
app.get('/organiserLogin', routes.organiserLogin);

//handling functions
var auth = function(req, res){
	var database = new databaseInstance(),
			password = req.body.password,
			user = req.body.user;

	var loginQuery = 'SELECT * FROM ' + databaseName + '.' + eventsTable +
  ' WHERE eventOrganiser ' +  ' = "' + user.toLowerCase() + '" ' +
  'AND organiserPassword ' + ' = "' + password + '"';
  console.log(loginQuery);

  if(user === '' || password === ''){
    res.redirect('/'); //obviously we need a fancy validation stuff instead.
  }else{
    database.query(loginQuery, function(error, result, row){
      if(!error) {
        if(result.length > 0){
          req.session.user = user;
          //res.render('createEvent', { title: 'Creación de eventos' });
          res.redirect('/organiserPanel');
        }else{
          res.redirect('/');
        }
      }else{
        console.log('Error');
        /*
         * In case of SQL injection inputs, like '"' or '"""' the page simply does
         * nothing. Nothing until a real user or pass are submited, so i don't see
         * the point on validate these stuff
        */
      }
    });
  }
};

//POST pages
app.post('/auth', auth);

https.createServer(httpsStuff, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});