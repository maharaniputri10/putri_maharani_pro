/* istanbul ignore file */    
const Jwt = require("@hapi/jwt");
const UsersTableTestHelper = require("./UsersTableTestHelper");

const ServerTestHelper = {
  async getAccessToken({
    id = "user-123",
    username = "testing",
    password = "secret",
    fullname = "Dicod",
  }) {
    return Jwt.token.generate(
      { id, username, password, fullname },
      process.env.ACCESS_TOKEN_KEY
    );
  },
};

module.exports = ServerTestHelper;