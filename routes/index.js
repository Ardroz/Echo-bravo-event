
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'event_name' });
};

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