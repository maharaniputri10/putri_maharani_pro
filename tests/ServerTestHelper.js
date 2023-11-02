// const Jwt = require('@hapi/jwt');
// const UsersTableTestHelper = require('./UsersTableTestHelper');

// const ServerTestHelper = {
//   async getAccessToken() {
//         const payloadUser = {
//         id: 'user1',
//         username: 'testing',
//         password: 'secret',
//         fullname: 'Dicod'
//         };

//     //await UsersTableTestHelper.addUser(payloadUser);
//     return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
 
// }
// };


// module.exports = ServerTestHelper;


const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
        const payloadUser = {
        id: 'user-123',
        username: 'testing',
        password: 'secret',
        fullname: 'Dicod'
        };
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
 
}
};


module.exports = ServerTestHelper;