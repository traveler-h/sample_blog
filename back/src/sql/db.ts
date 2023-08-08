//连接数据库封装
let mysql = require('mysql');
module.exports = (option: { host: string, user: string, password: string, datasourse: string, database: string } = {
  host: "",
  user: "",
  password: "",
  datasourse: "",
  database: ""
}, sql: any, callback: (arg0: any, arg1: any, arg2: any) => void) => {
  let host = option.host || '127.0.0.1';		//数据库所在的服务器的ip地址
  let user = option.user || 'root';				//用户名
  let password = option.password || 'root';		//密码
  let database = option.database || 'blog'  			//你的数据库名
  let db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
  });		//创建连接
  if (!(typeof sql == 'string')) {
    return;
  };
  // db.connect();		

  //打开连接
  db.connect(function (err: string) {
    if (err) {
      console.error('error connecting: ' + err)
      return
    }
    console.log('connected as id ' + db.threadId)
  })
  //数据库操作也是异步的
  db.query(sql, (error: any, results: any, fields: any) => {
    if (error) {
      console.log(error)
      return;
    }
    callback(error, results, fields);
  })
  //关闭连接
  db.end();
}