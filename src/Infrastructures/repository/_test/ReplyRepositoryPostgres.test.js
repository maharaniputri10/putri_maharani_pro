const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');



describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('createReply function', () => {
    it('should persist create reply and return', async () => {
      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      );
      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      );
      await CommentsTableTestHelper.addComment(
        { id: 'comment-123' }
      );

      const createReply = new CreateReply({
        content: 'Hallo',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      //  ID generator function
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const createdReply = await replyRepositoryPostgres.createReply(createReply);
      const replies = await RepliesTableTestHelper.findReplyById(createdReply.id);
      expect(replies).toHaveLength(1);
      expect(createdReply).toStrictEqual(new CreatedReply({
        id      : 'reply-123',
        content : createReply.content,
        owner   : createReply.owner
      }));
    });
  });


  describe('getReply By ThreadId function', () => {

    it('should return replies by thread id correctly', async () => {
      const threadId = 'thread-123';
      const Addreply = {
        id: 'reply-123',
        content: 'untuk Dicoding',
        owner: 'user-123',
        commentId: 'comment-123',
        date: new Date(),
      };
      const dataOwner = {
        id: 'user-123',
        username: 'dicod',
      };
      
      await UsersTableTestHelper.addUser(dataOwner); 
    
      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      ); 

      await CommentsTableTestHelper.addComment(
        { id: 'comment-123' }
      ); 

      await RepliesTableTestHelper.addReply(Addreply);

      const fakeIdGenerator = () => '123'; //  ID generator function
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replyByThreadId = await replyRepositoryPostgres.getReplyByThreadId(threadId);

      // Assert
      expect(replyByThreadId).toBeDefined();
      expect(replyByThreadId).toHaveLength(1);

      expect(replyByThreadId[0]).toHaveProperty('id');
      expect(replyByThreadId[0].id).toEqual(Addreply.id);

      expect(replyByThreadId[0]).toHaveProperty('content');
      expect(replyByThreadId[0].content).toEqual(Addreply.content);

      expect(replyByThreadId[0]).toHaveProperty('date');
      expect(replyByThreadId[0].date).toEqual(Addreply.date);

      expect(replyByThreadId[0]).toHaveProperty('username');
      expect(replyByThreadId[0].username).toEqual(dataOwner.username);

      expect(replyByThreadId[0]).toHaveProperty('comment_id');
      expect(replyByThreadId[0].comment_id).toEqual(Addreply.commentId);

      expect(replyByThreadId[0]).toHaveProperty('is_delete');
      expect(replyByThreadId[0].is_delete).toEqual(false); 
    });
  });


  describe('verifyReplyIsExist', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      return expect(replyRepositoryPostgres.verifyReplyIsExist('hello')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      );

      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      ); 

      await CommentsTableTestHelper.addComment(
        { id: 'comment-123' }
      );

      await RepliesTableTestHelper.addReply({ id: replyId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      return expect(replyRepositoryPostgres.verifyReplyIsExist(replyId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });


  describe('verifyReplyOwner function', () => {
    it('should throw UnAuthorizationError when wrong user', async () => {
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const userId = 'user-123';
      const wrongUser = 'dicoding';

      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      );
      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      );
      await CommentsTableTestHelper.addComment(
        { id: commentId }
      );
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: userId,
        commentId
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      expect(replyRepositoryPostgres.verifyReplyOwner(replyId, wrongUser)).rejects.toThrowError(AuthorizationError);
    });


    it('should verify the reply owner correctly', async () => {
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const userId = 'user-123';

      await UsersTableTestHelper.addUser(
        { id: userId }
      );

      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      );

      await CommentsTableTestHelper.addComment(
        { id: commentId }
      );

      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: userId,
        commentId
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId)).resolves.not.toThrowError(AuthorizationError);
    });
  });


  describe('delete Reply By Id function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      return expect(replyRepositoryPostgres.deleteReplyById('id_delete')).rejects.toThrowError(NotFoundError);
    });

    it('should delete reply by id and return success', async () => {
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });

      await RepliesTableTestHelper.addReply(
        {
          id: replyId, 
          owner: 'user-123',
          commentId 
        }
      );

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReplyById(replyId);

      const replies = await RepliesTableTestHelper.findReplyById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });
});
