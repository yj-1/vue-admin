import { Router } from 'express'
// import User from '../modules/user'
import bcrypt from 'bcrypt'
import { authenticate } from 'passport'
import User from '../modules/user'
import * as jwt from 'jsonwebtoken'
import { key } from '../config/config'
import end from '../utils/result'

const router = Router()

router.post("/register", (req, res) => {
  console.log(req.body)
  User.findOne({ name: req.body.username })
    .then((user) => {
      if (!!user) {
        return end.r304(res, {msg: "该用户已存在！"})
      } else {
        const newUser:any = new User({
          name: req.body.username,
          email: req.body.email,
          identity: req.body.identity,
          password: req.body.password,
          date: Date.now()
        })
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            throw err
          }
          newUser.password = hash
          newUser.save()
            .then((user) => {
              if(!user) {
                return end.r500(res, {msg: "注册失败，请联系后台管理人员！"})
              }
              return end.r0(res, {msg: "注册成功！"})
            })
            .catch((err) => {
              return end.r500(res, {msg: "服务器异常！"})
            })
        })
      }
    })
}) // 注册

router.post('/login', (req, res) => {
  const { username, password } = req.body
  // 查询
  User.findOne({ name: username })
    .then((user: any) => {
      if (!user) {
        return end.r404(res, {msg: "该用户不存在！"})
      }
      // 解密
      bcrypt.compare(password, user.password, (err, result) => {
        console.log(result, password)
        if (result) {
          // 创建规则
          const rule = { id: user.id, name: user.name }
          // 生产token
          jwt.sign(rule, key, { expiresIn: 30 * 60 }, (err, token) => {
            if (err) {
             return console.log(err)
            }
            end.r0(res, {
              statusText: "登陆成功！",
              result: {
                success: true,
                identity: user.identity,
                name: user.name,
                token: 'Bearer ' + token
              }
            })
          })
        } else {
          return end.r400(res, {msg: "密码错误！"})
        }
      })
    })
}) // 登录

router.get('/cur', authenticate('jwt', {session: false}), (req, res) => {
  console.log(req.user)
  res.status(200).json(req.user)
})

export default router