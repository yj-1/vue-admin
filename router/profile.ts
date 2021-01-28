import { Router } from 'express'
import { authenticate } from 'passport'
import Profile from '../modules/Profile'
import end from '../utils/result'
const router = Router()

type tsProfile = {
  type?: string,
  describe?: string,
  income?: string,
  expend?: string,
  cash?: string,
  remark?: string,
  date?: number
}
const auth = authenticate('jwt', { session: false })
function getProfile(req) {
  const profile: tsProfile = {}
  const { type, describe, income, expend, cash, remark } = req.body
  if (type) { profile.type = type }
  if (describe) profile.describe = describe
  if (income) profile.income = income
  if (expend) profile.expend = expend
  if (cash) profile.cash = cash
  if (remark) profile.remark = remark
  return profile
}

router.get('/', auth, (req, res) => {
  Profile.find()
    .then(result => {
      if (!result) {
        end.r404(res, { msg: "暂无数据！" })
      } else {
        // res.json(result)
        end.r0(res, { result })
      }
    })
}) // 获取所有数据

router.post('/add', auth, (req, res) => {
  const profile = getProfile(req)
  Profile.findOne(profile)
    .then(result => {
      if (!result) {
        const Pro = new Profile(profile)
        Pro.save()
          .then(result => {
            return end.r0(res, { result, msg: "添加成功！" })
          })
          .catch(err => {
            return end.r500(res, { msg: "添加失败!" })
          })
      } else {
        return end.r304(res, { msg: "请勿重复添加！" })
      }
    })
    .catch(err => {
      return end.r500(res)
    })
}) // 添加新信息

router.post('/edit/:id', auth, (req, res) => {
  const profile = getProfile(req)
  if (!req.params.id) {
    // return res.status(404).json({msg: '没有id！'})
    return end.r404(res, { msg: "id不存在！" })
  }
  Profile.findByIdAndUpdate(req.params.id, { $set: profile }, { new: false })
    .then(result => {
      if (!result) {
        return end.r500(res, { msg: "修改失败！" })
      } else {
        return end.r0(res, { msg: "修改成功！" })
      }
    })
    .catch(err => {
      console.log(err)
      // res.json({msg: '服务器异常！'})
      end.r500(res)
    })
}) // 修改数据

router.post('/delete/:id', auth, (req, res) => {
  if (!req.params.id) {
    // return res.json({msg: '请输入id！'})
    return end.r404(res, { msg: "id不存在！" })
  }
  Profile.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        // res.json({msg: '删除成功！'})
        return end.r0(res, { msg: "删除成功！" })
      } else {
        // res.json({msg: '删除失败！'})
        return end.r500(res, { msg: "删除失败！" })
      }
    })
    .catch(err => {
      return end.r404(res, { msg: "id不存在！" })
    })
}) // 删除数据

router.post('/deleteMany', auth, (req, res) => {
  const { list } = req.body
  if (Array.isArray(list) && list.length) {
    Profile.deleteMany({ _id: { $in: list } })
      .then(result => {
        if (result) {
          return end.r0(res, { msg: "删除成功！" })
          // return res.json({msg: '删除成功！'})
        } else {
          return end.r500(res, { msg: "删除失败！" })
          // return res.json({msg: '删除失败！'})
        }
      })
  } else {
    // return res.json({msg: '请检查list字段！'})
    return end.r404(res, { msg: "请检查需要修改的数据！" })
  }
}) // 删除多条


export default router