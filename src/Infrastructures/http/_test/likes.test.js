const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');


describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    const userPayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    await UsersTableTestHelper.addUser(userPayload);
  });
 
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and liked comment', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });


    it('should response 404 when thread or comment not found', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      const threadId = 'thread-111';
      const commentId = 'comment-222';

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});