
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'event_name' });
};

exports.organiserPanel = function(req, res){
  res.render('organiserPanel', { title: 'echo_bravo' });
};