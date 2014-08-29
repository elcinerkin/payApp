var express  = require('express');
var request  = require('request');
var http 		 = require('http');
var routes 	 = require('./server/routes')
var exchange = require('./server/exchange');
var bodyParser = require('body-parser');

// Creates an express application
var app = express();

// Configures the application
app.configure(function() {
    app.set('port', process.env.PORT || 8000);
    app.set('base url', process.env.URL || 'http://127.0.0.1');
    app.set('title', 'myPayApp')
    app.use(express.urlencoded());
    app.use(bodyParser.json());
    app.use(app.router);
    app.use( express.static(__dirname + '/public'));
});

// Starts the server listening on the given port
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

routes(app);

exports = module.exports = app;