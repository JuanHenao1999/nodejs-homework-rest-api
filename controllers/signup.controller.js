const User = require("../service/schemas/users");
const { getUserByEmail } = require("../service/userService");
require("dotenv").config();
const gravatar = require("gravatar");

const signupCtrl = async (req, res, next) => {
  const { username, email, password, subscription, token } = req.body;
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const avatarURL = gravatar.url(email);
    const newUser = new User({ username, email, subscription, token, avatarURL });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = signupCtrl;