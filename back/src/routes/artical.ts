const express = require('express');
const artical = express.Router();
const path = require("path");
let db = require('../sql/db.ts');

artical.get('/getList', function (req: any, res: any, next: any) {
  let pageNum: number, pageSize: number, data;
  if (Object.keys(req.query).length == 2) {
    pageNum = req.query.pageNum
    pageSize = req.query.pageSize
    const params = [(pageNum - 1) * pageSize, pageSize]
    const sql = `select * from artical limit ${(pageNum - 1) * pageSize},${pageSize}`
    db(
      { database: 'blog' },
      sql,
      function (err: any, result: any, fields: any) {
        if (err) {
          res.json({
            code: 1,
            message: '查询失败'
          })
        } else {
          let sqlTotal = 'select count(*) as total from artical' //as更换名称
          db({ database: 'blog' }, sqlTotal, function (error: any, among: any) {
            if (error) {
            } else {
              data = JSON.stringify(result);
              data = JSON.parse(data);
              let total = among[0]['total'] //查询表中的数量
              res.send({
                code: 200,
                msg: "success",
                data,
                pages: {
                  pageNum: pageNum,
                  pageSize: pageSize,
                  total: total
                }
              })
            }
          })
        }
      }
    )
  } else {
    return res.send({
      code: 500,
      msg: "请将信息填写完整！！"
    });
  }
})

artical.get(`/getArticalById`, function (req: any, res: any) {
  if (req.query.id) {
    let data
    let selectSql: string = `select * from artical where articalId = ${req.query.id}`
    db({
      database: 'blog'
    }, selectSql, (err: any, result: any) => {
      data = JSON.stringify(result)
      data = JSON.parse(data)
      if (data.length > 0) {
        res.send({
          code: 200,
          data,
          msg: ''
        })
      } else {
        return res.send({
          code: 500,
          msg: '该文章不存在！！',
          data: null
        })
      }
    })
  } else {
    return res.send({
      code: 500,
      msg: '请选择文章！！',
      data: null
    })
  }
})

artical.post('/createArtical', (req: any, res: any, next: any) => {
  if (Object.keys(req.body).length > 0) {
    let { title, subTitle, introduction, content, authorId, categoryId, articalId } = req.body
    let data
    let selectSql = `select * from artical where articalId=${articalId}`
    db({ database: 'blog' },
      selectSql,
      function (err: any, result: any, fields: any) {
        data = JSON.stringify(result)
        data = JSON.parse(data)
        if (!data.length) {
          let insertSql = `insert into artical(title, subTitle, introduction, content, authorId, author, categoryId, category, createDate, updateDate)
           values('${title}', '${subTitle}', '${introduction}', '${content}', ${authorId}, 
           (select username from user where userId = authorId),${categoryId},
           (select categoryName from category where categoryId = categoryId) , NOW(), NOW())`
          db({ database: 'blog' },
            insertSql,
            function (error: any, insertResult: any) {
              data = JSON.stringify(insertResult)
              data = JSON.parse(data)
              if (!error) {
                return res.send({
                  code: 200,
                  msg: '新增成功',
                  data: null
                })
              }
            })
        } else {
          return res.send({
            code: 200,
            msg: '该文章已存在！！',
            data: null
          })
        }
      }
    )
  } else {
    return res.send({
      code: 500,
      msg: '请将信息填写完整！！',
      data: null
    })
  }
})

artical.put('/updateArtical', (req: any, res: any, next: any) => {
  let data
  if (Object.keys(req.body).length > 0) {
    const { articalId, title, subTitle, introduction, content, authorId, categoryId } = req.body
    const selectSql = `select * from artical where articalId =  ${articalId}`
    db({ database: 'blog' }, selectSql, (error: any, result: any) => {
      data = JSON.stringify(result)
      data = JSON.parse(data)
      if (data.length) {
        const updateSql = `update artical  set title='${title}', 
        subTitle='${subTitle}', introduction='${introduction}', content='${content}', 
        authorId=${authorId}, author=(select username from user where userId=${authorId}),
        categoryId=${categoryId}, category=(select categoryName from category where categoryId=${categoryId}),
        updateDate=NOW()
        where articalId=${articalId}`
        db({ database: 'blog' }, updateSql, (updateError: any, updateResult: any) => {
          data = JSON.stringify(updateResult)
          data = JSON.parse(data)
          if (!updateError) {
            return res.send({
              code: 200,
              msg: '更新成功',
              data: null
            })
          } else {
            return res.send({
              code: 500,
              msg: '更新失败',
              data: null
            })
          }
        })
      } else {
        res.send({
          code: 500,
          msg: '该文章不存在',
          data: null
        })
      }
    })
  } else {
    return res.send({
      code: 500,
      msg: '请将信息填写完整！！',
      data: null
    })
  }
})

artical.delete('/deleteArtical/:id', (req: any, res: any, next: any) => {
  const articalId = req.params.id
  let data
  if (!articalId) {
    return res.send({
      code: 500,
      msg: '请将信息填写完整！！',
      data: null
    })
  } else {
    const deleteSql = `delete from artical where articalId=${articalId}`
    db({ database: 'blog' }, deleteSql, (err: any, result: any) => {
      if (!err) {
        return res.send({
          code: 200,
          msg: '删除成功',
          data: null
        })
      } else {
        res.send({
          code: 500,
          data: null,
          msg: '删除失败'
        })
      }
    })
  }
})

artical.post('/upload-image', async function (req: any, res: any, next: any) {
  try {
    if (!req.files) {
      res.send({
        status: 500,
        message: 'No file uploaded'
      });
    } else {
      let image = req.files.image;
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      image.mv(path.join(__dirname, `../../public/images/${image.name}`));
      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size,
          url: `localhost:3000/images/${image.name}`
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
})


module.exports = artical;
export { }