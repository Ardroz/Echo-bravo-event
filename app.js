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
	prePartakersTable = 'prePartakers',
	partakersTable 		= 'partakers',
	echosTable				= 'echos',
	messagesTable 		= 'messages';

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
app.get('/organiserPanel', routes.organiserPanel);
app.get('/organiserPanelRecords', login, routes.organiserPanelRecords);
app.get('/organiserPanelMessages', login, routes.organiserPanelMessages);
app.get('/organiserPanelEchos', login, routes.organiserPanelEchos);
app.get('/organiserLogin', routes.organiserLogin);

//handling functions
var auth = function(req, res){
	var database = new databaseInstance(),
			password = req.body.password,
			user = req.body.user;

	var loginQuery = 'SELECT * FROM ' + databaseName + '.' + eventsTable +
  ' WHERE eventOrganiser ' +  ' = "' + user.toLowerCase() + '" ' +
  'AND organiserPassword ' + ' = "' + password + '"';

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

var getPrepartakersTable = function(req, res){
  var database = new databaseInstance();

  var selectAllPrepartakersQuery = 'SELECT * FROM ' + databaseName + '.'+prePartakersTable;

  database.query(selectAllPrepartakersQuery, function(error, result, row){
    if(!error) {
      res.send(result);
    }else{
      console.log('Error selectAllPrepartakersQuery');
    }
  });
}

var searchPrepartaker = function(req, res){
  var database = new databaseInstance();
  var searchPrepartakerQuery =  'SELECT * FROM ' + databaseName + '.'+prePartakersTable + ' WHERE partakerName = "' + req.body.name + '"';

  database.query(searchPrepartakerQuery, function(error, result, row){
    if(!error) {
      res.send(result);
    }else{
      console.log('Error selectAllPrepartakersQuery');
    }
  });
}

var modifyPrepartaker = function(req, res){
  var database = new databaseInstance(),
      newName = req.body.name,
      newMail = req.body.mail,
      newPhone = req.body.phone,
      newAddress = req.body.address,
      name = req.body.nameToChange,
      updatePrepartakerQuery =  'UPDATE  '+ databaseName + '.'+prePartakersTable+' SET '+
                                'partakerName = "' +newName+'",'+
                                'partakerMail = "' +newMail+'",'+
                                'partakerPhone = "' +newPhone+'",'+
                                'partakerAddress = "' +newAddress+'" WHERE partakerName = "' + name + '"';

  database.query(updatePrepartakerQuery, function(error, result, row){
    if(!error) {
      res.redirect('/organiserPanel');
    }else{
      console.log('Error selectAllPrepartakersQuery');
    }
  });
}

var validatePrepartaker =  function(req, res){
	var database = new databaseInstance(),
			user = req.body.user,
			password = req.body.password,
			folio = req.body.folio,
			partakerId = req.body.partakerId,
			updatePrepartakerFlagQuery =  'UPDATE  '+ databaseName + '.'+prePartakersTable+' SET '+
																		'validateFlag = 1 WHERE partakerId = "' + partakerId + '"',
			insertNewPartakerQuery= 'INSERT INTO  '+ databaseName + '.'+partakersTable+' ('+
															'partakerId,partakerUser,partakerPassword,partakerBaucher) VALUES('+
															'"'+partakerId+'",'+'"'+user+'",'+'"'+password+'",'+'"'+folio+'")';

	database.query(updatePrepartakerFlagQuery, function(error, result, row){
		if(!error) {
			database.query(insertNewPartakerQuery, function(error, result, row){
				if(!error) {
					res.redirect('/organiserPanel');
				}else{
					console.log('Error insertNewPartakerQuery');
				}
			});
		}else{
			console.log('Error validatePrepartaker');
		}
	});
}

var deletePrepartaker =  function(req, res){
	var database = new databaseInstance(),
			partakerId = req.body.partakerId,
			validateFlag = req.body.validateFlag,
			deletePrepartakerQuery = 'DELETE FROM '+databaseName+'.'+prePartakersTable+' WHERE partakerId ='+partakerId,
			deletePartakerQuery = 'DELETE FROM '+databaseName+'.'+partakersTable+' WHERE partakerId ='+partakerId;

	database.query(deletePrepartakerQuery, function(error, result, row){
		if(!error) {
			if(validateFlag != 0){
				database.query(deletePartakerQuery, function(error, result, row){
					if(!error) {
						res.redirect('/organiserPanel');
					}else{
						console.log('Error deletePartakerQuery');
					}
				});
			}else{
				res.redirect('/organiserPanel');
			}
		}else{
			console.log('Error deletePrepartakerQuery');
		}
	});
}

var insertPrepartaker =  function(req, res){
	var database = new databaseInstance(),
			name = req.body.name,
			mail = req.body.mail,
			phone = req.body.phone,
			address = req.body.address;
			insertNewPrepartakerQuery= 'INSERT INTO  '+ databaseName + '.'+prePartakersTable+' ('+
															'partakerId,eventId,partakerName,partakerMail,partakerPhone,partakerAddress,validateFlag) VALUES('+
															'NULL ,"'+eventId+'",'+'"'+name+'",'+'"'+mail+'",'+'"'+phone+'",'+'"'+address+'",0)';
	database.query(insertNewPrepartakerQuery, function(error, result, row){
		if(!error) {
			res.redirect('/organiserPanel');
		}else{
			console.log('Error insertPrepartaker');
		}
	});
}

//POST pages
app.post('/auth', auth);
app.post('/getPrepartakersTable', getPrepartakersTable);
app.post('/deletePrepartaker', deletePrepartaker);
app.post('/insertPrepartaker', insertPrepartaker);
app.post('/modifyPrepartaker', modifyPrepartaker);
app.post('/searchPrepartaker', searchPrepartaker);
app.post('/validatePrepartaker', validatePrepartaker);

https.createServer(httpsStuff, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});