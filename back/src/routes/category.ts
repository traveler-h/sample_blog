let express = require('express');
let category = express.Router();
let db = require('../sql/db.ts');
/* GET home page. */
category.get('/getAllCategoryList', function (req: any, res: any, next: any) {
  let data
  const selectSql = 'select * from category'
  db({ database: 'blog' }, selectSql, (error: any, result: any) => {
    data = JSON.stringify(result);
    data = JSON.parse(data);
    res.send({
      code: 200,
      msg: '',
      data
    })
  })
});

category.get('/getCategoryById/:id', (req: any, res: any, next: any) => {
  let data
  const selectSql = `select * from category where categoryId=${req.params.id}`
  db({ database: 'blog' }, selectSql, (error: any, result: any) => {
    if (!error) {
      data = JSON.stringify(result);
      data = JSON.parse(data);
      if (data.length) {
        res.send({
          code: 200,
          msg: '',
          data
        })
      }
    } else {
      res.send({
        code: 500,
        msg: '查询失败',
        data: null
      })
    }
  })
})

category.post('/createCategory', (req: any, res: any, next: any) => {
  if (Object.keys(req.body).length > 0) {
    let data
    const { categoryName, categoryDesc, categoryId } = req.body
    const selectSql = `select * from category where categoryId=${categoryId}`
    db({ database: 'blog' }, selectSql, (selectErr: any, selectRes: any) => {
      data = JSON.stringify(selectRes);
      data = JSON.parse(data);
      if (data.length) {
        res.send({
          code: 500,
          msg: '该分类已存在',
          data: null
        })
      } else {
        const insertSql = `insert into category(categoryName, categoryDesc) values (${categoryName}, ${categoryDesc})`
        db({ database: 'blog' }, insertSql, (insertErr: any, insertRes: any) => {
          if (!insertErr) {
            res.send({
              code: 200,
              msg: '新增成功',
              data: null
            })
          }
        })
      }
    })
  } else {
    res.send({
      code: 500,
      msg: '请填写完整信息',
      data: null
    })
  }
})

category.put('/updateCategory', (req: any, res: any, next: any) => {
  if (Object.keys(req.body).length > 0) {
    let data
    const { categoryName, categoryDesc, categoryId } = req.body
    const updateSql = `update category set categoryName='${categoryName}',categoryDesc='${categoryDesc}'  where categoryId = ${categoryId}`
    db({ database: 'blog' }, updateSql, (updateErr: any, updateRes: any) => {
      data = JSON.stringify(updateRes);
      data = JSON.parse(data);
      if (!updateErr) {
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
      msg: '请填写完整信息',
      data: null
    })
  }
})

category.delete('/deleteCategory/:id', (req: any, res: any, next: any) => {
  const categoryId = req.params.id
  let data
  if (!categoryId) {
    return res.send({
      code: 500,
      msg: '请将信息填写完整！！',
      data: null
    })
  } else {
    const deleteSql = `delete from category where categoryId=${categoryId}`
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

module.exports = category;
export { }