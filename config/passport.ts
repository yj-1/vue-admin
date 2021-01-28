import { Strategy, ExtractJwt } from 'passport-jwt'
import { key } from '../config/config'
import User from '../modules/user'
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key
}

export default (passport => passport.use(new Strategy(opts, function (jwt_payload, done) {
  User.findOne({ _id: jwt_payload.id }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, {id: user.id, name: user.name, identity: user.identity, date: user.date});
    } else {
      return done(null, false);
    }
  })
})))