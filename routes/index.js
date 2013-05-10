
/*
 * GET home page.
 */
var ip = 'localhost',
		mysql		= require('mysql'),
		aesKey			= 'c!A=wq(0c&yw@3w',
		databaseName	= 'echodb',
		eventsTable		= 'events',
		eventName			= 'ExpoBátiz',
		eventId				= '0000000001',
		prePartakersTable = 'prepartakers',
		partakersTable= 'partakers',
		echosTable				= 'echosn',
		messagesTable	= 'messagesn',
		ip = 'localhost';

function databaseInstance(){
	var connection = mysql.createConnection({
		host     : ip,
		password : 'n0m3l0',
		user     : 'root'
	});
	return connection;
}

exports.organiserPanel = function(req, res){
  res.render('organiserPanel', { title: 'echo_bravo' });
};

exports.organiserPanelRecords = function(req, res){
  res.render('organiserPanelRecords', { title: 'echo_bravo' });
};

exports.organiserPanelMessages = function(req, res){
  res.render('organiserPanelMessages', { title: 'echo_bravo' });
};

exports.organiserPanelEchos = function(req, res){
  res.render('organiserPanelEchos', { title: 'echo_bravo' });
};

exports.organiserLogin = function(req, res){
  res.render('organiserLogin', { title: 'echo_bravo' });
};

exports.nosotros = function(req, res){
  res.render('nosotros', { title: 'echo_bravo' });
};

exports.index = function(req, res){
  res.render('index', { title: 'event_name' });
};

exports.preregistro = function(req, res){
  res.render('preregistro', { title: 'event_name' });
};

exports.credentials = function(req, res){
	var database = new databaseInstance(),
			searchPrepartakerQuery =  'SELECT * FROM ' + databaseName + '.'+prePartakersTable + ' WHERE partakerid = ' + req.body.partakerId;
	database.query(searchPrepartakerQuery, function(error, result, row){
		if(!error) {
			console.log(result[0].partakerName);
			res.render('credentials', { eventName: eventName,name:result[0].partakerName,mail:result[0].partakerMail });
		}else{
			console.log('Error searchPrepartakersQuery');
		}
	});
};