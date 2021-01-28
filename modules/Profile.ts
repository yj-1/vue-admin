import { Schema, model } from 'mongoose'

const Profile = new Schema({
  type: {
    type: String
  },
  describe: {
    type: String
  },
  income: {
    type: String
  },
  expend: {
    type: String
  },
  cash: {
    type: String
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default model('profiles', Profile)