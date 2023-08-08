let createError = require("http-errors"); //用来创建http请求错误的模块
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser"); //客户端中间件
let session = require("express-session");
let bodyParser = require("body-parser");
let fileUpload = require('express-fileupload');
let multer = require('multer')
let logger = require("morgan");
let winston = require("./common/errorLog");
let cors = require("cors");
let fs = require("fs");
let corsRequest = require("./common/corsRequest.ts");
let indexRouter = require('./routes/index.ts');
let userRouter = require("./routes/users.ts")
let articalRouter = require("./routes/artical.ts")
let categoryRouter = require("./routes/category.ts")

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 输出日志到目录
let accessLogStream = fs.createWriteStream(
	path.join(__dirname, "./log/request.log"),
	{ flags: "a", encoding: "utf8" }
);
app.use(logger("combined", { stream: accessLogStream }));
//跨域配置
corsRequest(app);
//静态托管，在搭建大前端时将页面放置public文件夹
app.use(express.static(path.join(__dirname, "public")));
//种session存cookie配置
app.use(cookieParser("123456"));
app.use(
	session({
		secret: "123456",
		resave: false,
		saveUninitialized: true,
	})
);

//安装中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(fileUpload({
  createParentPath: true
}));
//路由配置
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/artical', articalRouter);
app.use('/category', categoryRouter);

//用来捕获错误处理函数
app.use(function (req: any, res: any, next: (arg0: any) => void) {
	next(createError(404));
});

// error handler
app.use(function (err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; originalUrl: any; method: any; ip: any; }, res: { locals: { message: any; error: any; }; status: (arg0: any) => void; render: (arg0: string) => void; }, next: any) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	winston.error(
		`${err.status || 500} - ${err.message} - ${req.originalUrl} -${
			req.method
		} - ${req.ip}`
	);
	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

app.use(
	cors({
		origin: ["http://127.0.0.1:5173", "http://127.0.0.1:3088"],
		credential: true,
		methods: "DELETE,PUT,POST,GET,OPTIONS",
	})
);
// 设置静态文件
app.use(express.static(path.join(__dirname, `../public`)));
console.log(path.join(__dirname, `../public`))
// app.use(multer({dest: './assets'}).any())
module.exports = app;
export {}