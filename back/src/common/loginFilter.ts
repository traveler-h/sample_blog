function loginFilter(app: { use: (arg0: (req: any, res: any, next: any) => any) => void; }) {
	app.use(function (req: { session: { auth_username: any; auth_password: any; }; signedCookies: { username: any; password: any; }; url: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { msg: string; }): any; new(): any; }; }; }, next: () => void) {
    console.log(req.session)
		if (!(req.session.auth_username && req.session.auth_password)) {
			if (req.signedCookies.username && req.signedCookies.password) {
				let { username, password } = req.signedCookies;
				req.session.auth_username = username;
				req.session.auth_password = password; //将cookie的值存在session里
				next();
			} else {
				let arr = req.url.split("/");
				let index =
					arr &&
					arr.findIndex((item: string | string[]) => {
						return item.indexOf("login") != -1 || item.indexOf("relogin") != -1;
					});
				if (index !== -1) {
					next();
				} else {
					return res.status(401).json({
						msg: "没有登入，请先登入",
					});
				}
			}
		} else {
			next();
		}
	});
}
module.exports = loginFilter;
