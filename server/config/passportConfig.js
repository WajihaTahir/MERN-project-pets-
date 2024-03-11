//FOR AUTHENTICATION

import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UserModel from "../models/userModel.js";
//passport is a popular authentication middleware which uses passport-jwt authetication
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //to extract token from header
  secretOrKey: process.env.TOK_PASSWORD,
};
const jwtStrategy = new JwtStrategy(options, async function (
  jwt_payload, //contains the information about the user
  done
) {
  try {
    const user = await UserModel.findOne({ _id: jwt_payload.sub }); //to retrieve the corresponding user from the database.
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
