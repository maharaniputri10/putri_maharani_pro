/**testing */

const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');


describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    
    afterAll(async () => {await pool.end()});
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
        
    });


describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {

      const requestPayload = { 
        content: 'Dicoding Indonesia ' 
      };

      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );

      await CommentsTableTestHelper.addComment(
        { id: commentId, threadId }
      );
      
      const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments/${commentId}/replies`,
            payload: requestPayload,
            headers: { Authorization: `Bearer ${accessToken}`}
        });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });


    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );

      await CommentsTableTestHelper.addComment(
        { id: commentId, threadId }
      );

     
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {Authorization: `Bearer ${accessToken}`}
      });

      
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda Tidak dapat membuat balasan baru, property tidak ditemukan');
    });


    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = { content: 123 };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );

      await CommentsTableTestHelper.addComment(
        { id: commentId, threadId }
      );

      
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}`},
      });

    
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('type data is not match');
    });
  });


  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
   
    it('should response 200 and delete reply successfully', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );

      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment(
        { id: commentId, threadId }
      );
      
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply(
        { id: replyId, commentId }
      );

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {Authorization: `Bearer ${accessToken}`},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });


    it('should response 403 when user is not an authorized owner of the reply', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const anotherUserId = 'userNotOwner';
      await UsersTableTestHelper.addUser(
        { id: anotherUser, username: 'userNotOwner' }
      );
      
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );
      
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment(
        { id: commentId, threadId }
      );
      
      const replyId = 'reply-123';
      await RepliesTableTestHelper.addReply(
        { id: replyId, commentId, owner: anotherUser }
      );

      
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { 
          Authorization: `Bearer ${accessToken}`
        }
      });

      
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak mempunyai hak akses');
    });

    
    it('should response 404 when thread or comment does not exist', async () => {
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { 
          Authorization: `Bearer ${accessToken}`
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  
}); 