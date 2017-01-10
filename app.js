var express = require('express');
var routes = require('./routes');
var config = require('config-lite');
var pkg = require('./package')
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
const path = require('path');

var app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	name : config.session.key,
	secret : config.session.secret,
	cookie : {
		maxAge : 1000*60*60*24
	},
	store : new MongoStore({
		url : config.mongodb
	})
}));

app.use(flash());

routes(app);

app.listen(config.port,function(){
	console.log(`${pkg.name} is listening on port ${config.port}`);
});