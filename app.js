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

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

routes(app);

app.listen(config.port,function(){
	console.log(`${pkg.name} is listening on port ${config.port}`);
});