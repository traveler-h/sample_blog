var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req: any, res: any, next: any) {
  return res.send({
    code: 200,
    msg: "测试接口"
  });
});

module.exports = router;
export { }
