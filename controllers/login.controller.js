const User = require("../service/schemas/users");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../service/userService");
require("dotenv").config();
const secret = process.env.SECRET;

const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
      data: "Bad request",
    });
  }
  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

module.exports = loginCtrl;
