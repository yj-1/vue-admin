import { Schema, model, Document } from 'mongoose'
type tsUser = {
  name: string;
  email?: string;
  password: string;
  avatar?: string;
  rule: String;
  date: Date;
}
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  rule: {
    type: String
  },
  date: {
    type: Date,
    defualt: Date.now
  }
})
// const user = mongoose.model('users', UserSchema)
export default model('users', UserSchema)
// export default user