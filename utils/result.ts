type tsStatus = {
  status: number,
  statusText: string,
  [name: string]: any
}
const result = ((state: tsStatus) => {
  return (res, data?:object) => {
    return res.json({
      ...state,
      ...data
    })
  }
})

const end = {
  r0: result({status: 200, statusText: "获取成功！", result: true}),
  r304: result({status: 304, statusText: "重复！"}),
  r400: result({status:400, statusText: "验证失败！"}),
  r404: result({status: 404, statusText: "未找到数据！"}),
  r500: result({status: 500, statusText: "服务器异常！"}),
}

export default end