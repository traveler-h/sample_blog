function corsRequest(app: any) {
	app.all("*", (req: any, res: any, next: any) => {
		//设置允许跨域的域名，*代表允许任意域名跨域
		res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173, http://127.0.0.1:3088");
		//允许的header类型
		// res.header("Access-Control-Allow-Headers","X-Requested-With,Content-Type,content-type");
		res.header(
			"Access-Control-Allow-Headers:Origin,X-Requested-With,Authorization,Content-Type,Accept,Z-Key"
		);
		//跨域允许的请求方式
		res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
		res.header("X-Powered-By", "3.2.1");
		res.header("Content-Type", "application/json;charset=utf-8");
		res.header("Access-Control-Allow-Credentials", true);
		res.header("Cache-Control", "no-store");
		if (req.method.toLowerCase() == "options") {
			res.send(200); //让options尝试请求快速结束
		} else {
			next();
		}
	});
}
module.exports = corsRequest;
