import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  //creates a JSON web token for the given user id, used in usercontrollers login function
  //in payload, we put our registered claims such as "sub" or "iss"
  const payload = {
    sub: userId,
  };
  //password needed to generate and later validate the token
  const secretOrPrivateKey = process.env.TOK_PASSWORD;

  //in signOptions, we inlcude longer version of private claims and other custom claims

  const signOptions = {
    expiresIn: "20d",
  };
  const jsonwebtoken = jwt.sign(payload, secretOrPrivateKey, signOptions);
  return jsonwebtoken;
};

export { generateToken };
