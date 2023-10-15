const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');


describe('/threads/{threadId}/comments/... endpoint', () => {

  afterAll(async () => {
     await pool.end()
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  
  describe('when POST threads By comments', () => {
    it('should response 201 and persisted comment', async () => {
    
      const requestPayload = {
         content: 'content'
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread
      ({
         id: threadId 
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });


    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread
      ({ 
        id: threadId
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}`},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Sorry, tidak dapat membuat komentar baru');
    });


    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = { content: 123 };
      const accessToken = await ServerTestHelper.getAccessToken();

      const server = await createServer(container);

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tipe data tidak sesuai');
    });
  });


  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
   
    it('should response 201 and delete comment successfully', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment
      ({ id: commentId, threadId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}`},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });


    it('should response 403 when user is not an authorized owner of the comment', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);
      const anotherUser = 'userNotOwner';
      await UsersTableTestHelper.addUser
      ({ 
        id: anotherUser, 
        username: 'userNotOwner'
      });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: anotherUserId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {Authorization: `Bearer ${accessToken}`},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat mengakses resource ini');
    });


    it('should response 404 when thread or comment does not exist', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);
      const threadId = 'thread-1234';
      const commentId = 'comment-02';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {Authorization: `Bearer ${accessToken}`},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toBeDefined();
    });
  });

  
});