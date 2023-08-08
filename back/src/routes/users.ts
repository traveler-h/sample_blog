const express = require('express');
const user = express.Router();
let db = require('../sql/db.ts');
//登录
user.get('/login', function (req: any, res: any, next: any) {
  let name: string, password: string, data;
  if (Object.keys(req.query).length == 2) {
    name = req.query.userName; //用户名
    password = req.query.userPassword; //用户密码
    db({
      database: 'blog'
    }, "SELECT username,password FROM user WHERE username='" + name + "' AND password='" + password + "'", function (
      err: any, result: any, fields: any) {
      data = JSON.stringify(result);
      data = JSON.parse(data);
      console.log(data)
      if (!data.length) {
        return res.send({
          code: 500,
          data,
          msg: "账号或密码错误，请重新填写！！"
        });
      } else {
        let bool = data.every((item: { username: string; password: string; }) => item.username == name && item.password == password);
        if (bool) {
          req.session.auth_username = name;
          req.session.auth_password = password;
          res.cookie('username', name, { maxAge: 1000 * 60 * 60 * 24 * 7, signed: true });		//设置cookie的保存时间，7天为例
          res.cookie('password', password, { maxAge: 1000 * 60 * 60 * 24 * 7, signed: true });	//console.log(req.signedCookies);
          return res.send({
            code: 200,
            msg: "登录成功！！",
            data
          });
        }
      }
    })
  } else {
    return res.send({
      code: 500,
      msg: "请将信息填写完整！！"
    });
  }
});
//注册
user.post('/register', function (req: any, res: { send: (arg0: { code: number; msg: string; data: any }) => any; }, next: any) {
  let username: string, password: string, data: any
  if (Object.keys(req.body).length == 2) {
    username = req.body.userName
    password = req.body.userPassword
    db(
      {
        database: 'blog',
      },
      "SELECT username,password FROM user WHERE username='" +
      username +
      "' AND password='" +
      password +
      "'",
      function (err: any, result: any, fields: any) {
        data = JSON.stringify(result)
        data = JSON.parse(data)
        console.log(data)
        if (!data.length) {
          db(
            { database: 'blog' },
            "INSERT INTO user(username,password) VALUES ('" +
            username +
            "','" +
            password +
            "')",
            function (error: any, result: any, fields: any) {
              if (!error)
                return res.send({ code: 200, msg: '注册成功，即可登录！！', data })
            }
          )
        } else {
          return res.send({
            code: 500,
            msg: '该用户已存在，请重新注册信息！！',
            data
          })
        }
      }
    )
  } else {
    return res.send({
      code: 500,
      msg: '请将信息填写完整！！',
      data
    })
  }
});
//注销
user.get('/unreset', function (req: { session: { auth_username: undefined; auth_password: undefined; }; signedCookies: { username: any; password: any; }; }, res: { cookie: (arg0: string, arg1: any, arg2: { maxAge: number; signed: boolean; }) => void; send: (arg0: { code: number; msg: string; }) => any; }, next: any) {
  let user = req.session.auth_username;
  let pass = req.session.auth_password
  res.cookie('username', user, { maxAge: 0, signed: true });
  res.cookie('password', pass, { maxAge: 0, signed: true });
  req.session.auth_password = undefined;
  req.session.auth_username = undefined;
  let { username, password } = req.signedCookies;
  return res.send({
    code: 200,
    msg: '注销成功！！'
  });
})
module.exports = user;
export { }