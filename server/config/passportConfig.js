import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UserModel from "../models/userModel.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOK_PASSWORD,
};
const jwtStrategy = new JwtStrategy(options, async function (
  jwt_payload,
  done
) {
  try {
    const user = await UserModel.findOne({ _id: jwt_payload.sub });
    if (!user) {
      return done(null, false);
    }
    if (user) {
      return done(null, user);
    }
  } catch (err) {
    return done(err, false);
  }
});

export default jwtStrategy;
