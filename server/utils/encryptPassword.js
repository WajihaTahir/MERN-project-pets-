import bcrypt from "bcrypt";

const encryptPassword = async (userPassword) => {
  try {
    const saltRounds = 10; //no of rounds used in the hashing process to generate salt.
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(userPassword, salt);
    // Store hash in your password DB.
    return hashedPassword;
  } catch (error) {
    console.log("error hashing password", error);
    return null;
  }
};

const verifyPassword = async (myPlaintextPassword, hash) => {
  try {
    const isPasswordCorrect = await bcrypt.compare(myPlaintextPassword, hash);
    if (isPasswordCorrect) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error verifyng password");
    return false;
  }
};

export { encryptPassword, verifyPassword }; //used in signup and login functions in usercontrollers.
