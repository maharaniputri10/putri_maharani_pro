const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');


describe('/thread endpoint', () => {

  afterAll(async () => {
     await pool.end()
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
    
      const requestPayload = {
         content: 'Dicoding Indonesia'
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
      expect(responseJson.message).toEqual('silahkan lengkapi properti yang dibutuhkan');
    });


    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = { content: 123 };
      const accessToken = await ServerTestHelper.getAccessToken();

      const server = await createServer(container);

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread
      (
        { id: threadId }
      );

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
   
    it('should response 201 and comment deleted', async () => {
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


    it('should response 403 when wrong user', async () => {
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


    it('should response 404 when thread or comment not found', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {Authorization: `Bearer ${accessToken}`},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  
});