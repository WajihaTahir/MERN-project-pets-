import bcrypt from "bcrypt";

const encryptPassword = async (userPassword) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(userPassword, salt);
    // Store hash in your password DB.
    return hashedPassword;
  } catch (error) {
    console.log("error hashing password", error);
    return null;
  }
};

export default encryptPassword;
