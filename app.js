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
	partakersTable= 'partakers',
	echosTable				= 'echosn',
	messagesTable	= 'messagesn';

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
		res.redirect('/organiserLogin');
	}
}

//GET pages
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/organiserPanel',login, routes.organiserPanel);
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
				console.log('Error auth');
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
	var database = new databaseInstance(),
			selectAllPrepartakersQuery = 'SELECT * FROM ' + databaseName + '.'+prePartakersTable;

	database.query(selectAllPrepartakersQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error selectAllPrepartakersQuery');
		}
	});
};

var getPartakersTable = function(req, res){
	var database = new databaseInstance(),
			selectAllPrepartakersQuery = 'SELECT * FROM ' + databaseName + '.'+prePartakersTable + ' WHERE validateFlag = 1';

	database.query(selectAllPrepartakersQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error selectAllPartakersQuery');
		}
	});
};

var getMessagesTable = function(req, res){
	var database = new databaseInstance(),
			selectAllMessagesQuery = 'SELECT * FROM ' + databaseName + '.'+messagesTable;

	database.query(selectAllMessagesQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error selectAllMessagesQuery');
		}
	});
};

var getEchosTable = function(req, res){
	var database = new databaseInstance(),
			selectAllPrepartakersQuery = 'SELECT * FROM ' + databaseName + '.'+echosTable;

	database.query(selectAllPrepartakersQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error selectAllEchosQuery');
		}
	});
};

var deletePrepartaker =  function(req, res){
	var database = new databaseInstance(),
			partakerId = req.body.partakerId,
			validateFlag = req.body.validateFlag,
			deletePrepartakerQuery = 'DELETE FROM '+databaseName+'.'+prePartakersTable+' WHERE partakerId ='+partakerId,
			deletePartakerQuery = 'DELETE FROM '+databaseName+'.'+partakersTable+' WHERE partakerId ='+partakerId;

	database.query(deletePrepartakerQuery, function(error, result, row){
		if(!error) {
			if(validateFlag !== 0){
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
};

var deletePartaker = function(req, res){
	var database = new databaseInstance(),
			partakerId = req.body.partakerId,
			deletePartakerQuery = 'DELETE FROM '+databaseName+'.'+partakersTable+' WHERE partakerId ='+partakerId;
			updatePrepartakerFlagQuery =  'UPDATE  '+ databaseName + '.'+prePartakersTable+' SET '+
																		'validateFlag = 0 WHERE partakerId = "' + partakerId + '"';

	database.query(deletePartakerQuery, function(error, result, row){
		if(!error) {
			database.query(updatePrepartakerFlagQuery, function(error, result, row){
				if(!error) {
					res.redirect('/organiserPanelRecords');
				}else{
					console.log('Error updatePrepartakerFlagQuery');
				}
			});
		}else{
			console.log('Error deletePartakerQuery');
		}
	});
};

var insertPrepartaker =  function(req, res){
	var database = new databaseInstance(),
			name = req.body.name.replace(/['"<>=]/,""),
			age = req.body.age,
			gender = req.body.gender,
			mail = req.body.mail.replace(/['"<>=]/,""),
			phone = req.body.phone,
			address = req.body.address.replace(/['"<>=]/,"");
			insertNewPrepartakerQuery= 'INSERT INTO  '+ databaseName + '.'+prePartakersTable+' ('+
															'partakerId,eventId,partakerName,partakerMail,partakerPhone,partakerAddress,partakerAge,partakerGender,validateFlag) VALUES('+
															'NULL ,"'+eventId+'",'+'"'+name+'",'+'"'+mail+'",'+'"'+phone+'",'+'"'+address+'",'+'"'+age+'",'+'"'+gender+'",0)';
	database.query(insertNewPrepartakerQuery, function(error, result, row){
		if(!error) {
			res.redirect('/organiserPanel');
		}else{
			console.log('Error insertPrepartaker');
		}
	});
};

var modifyPrepartaker = function(req, res){
	var database = new databaseInstance(),
			newName = req.body.name.replace(/['"<>=]/,""),
			newAge = req.body.age,
			newGender = req.body.gender,
			newMail = req.body.mail.replace(/['"<>=]/,""),
			newPhone = req.body.phone,
			newAddress = req.body.address.replace(/['"<>=]/,""),
			name = req.body.nameToChange,
			updatePrepartakerQuery =  'UPDATE  '+ databaseName + '.'+prePartakersTable+' SET '+
																'partakerName = "' +newName+'",'+
																'partakerAge = "' +newAge+'",'+
																'partakerGender = "' +newGender+'",'+
																'partakerMail = "' +newMail+'",'+
																'partakerPhone = "' +newPhone+'",'+
																'partakerAddress = "' +newAddress+'" WHERE partakerName = "' + name + '"';

	database.query(updatePrepartakerQuery, function(error, result, row){
		if(!error) {
			res.redirect('/organiserPanel');
		}else{
			console.log('Error modifyPrepartakersQuery');
		}
	});
};

var modifyPartaker = function(req, res){
	var database = new databaseInstance(),
			newFolio = req.body.folio,
			partakerId = req.body.partakerId,
			updatePartakerQuery =	'UPDATE ' + databaseName +'.'+ partakersTable + ' SET '+
														'partakerBaucher = "'+ newFolio + '" WHERE partakerId = ' + partakerId;

	console.log(updatePartakerQuery);
	database.query(updatePartakerQuery, function(error, result, row){
		if(!error) {
			res.redirect('/organiserPanel');
		}else{
			console.log('Error modifyPartakersQuery');
		}
	});
};

var searchPrepartaker = function(req, res){
	var database = new databaseInstance();
	var searchPrepartakerQuery =  'SELECT * FROM ' + databaseName + '.'+prePartakersTable + ' WHERE partakerid = "' + req.body.id + '"';

	database.query(searchPrepartakerQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error searchPrepartakersQuery');
		}
	});
};

var searchPartaker = function(req, res){
	var database = new databaseInstance();
	var searchPrepartakerQuery =  'SELECT * FROM ' + databaseName + '.'+partakersTable + ' WHERE partakerId = "' + req.body.id + '"';

	database.query(searchPrepartakerQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error searchPrepartakersQuery');
		}
	});
};

var validatePrepartaker =  function(req, res){
	var database = new databaseInstance(),
			user = req.body.user.replace(/['"<>=]/,""),
			password = req.body.password,
			folio = req.body.folio.replace(/['"<>=]/,""),
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
};


//POST pages
app.post('/auth', auth);
app.post('/getPrepartakersTable', getPrepartakersTable);
app.post('/getPartakersTable', getPartakersTable);
app.post('/getMessagesTable', getMessagesTable);
app.post('/getEchosTable', getEchosTable);
app.post('/deletePrepartaker', deletePrepartaker);
app.post('/deletePartaker', deletePartaker);
app.post('/insertPrepartaker', insertPrepartaker);
app.post('/modifyPrepartaker', modifyPrepartaker);
app.post('/modifyPartaker', modifyPartaker);
app.post('/searchPrepartaker', searchPrepartaker);
app.post('/searchPartaker', searchPartaker);
app.post('/validatePrepartaker', validatePrepartaker);

https.createServer(httpsStuff, app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});