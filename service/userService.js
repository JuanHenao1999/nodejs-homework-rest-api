const User = require("./schemas/users");

const getUserByEmail = async (email) =>{
    return User.findOne({email});
}

module.exports = {
    getUserByEmail
}