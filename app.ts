import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import passport from 'passport'

import { url } from './config/config'
import pps from './config/passport'

// 路由导入
import Home from './router/home'
import Profile from './router/profile'

// 连接数据库
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('mongodb数据库连接成功！')
  })
  .catch((err: any) => {
    console.log(err,'mongodb数据库连接失败！')
  })

// 创建服务
const app = express()
// 创建端口
const port = process.env.PORT||3000

// 解析post的body
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// 开启鉴权
app.use(passport.initialize())
pps(passport)

// 路由
app.use('/', Home)
app.use('/profiles', Profile)

// 监听服务器
app.listen(port, () => {
  console.log(`服务已启动!\nhttp://localhost:${port}`)
})