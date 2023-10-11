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

//  ID generator function
const fakeIdGenerator = () => '123';

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
    it('should persist create reply and return created reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: '123' });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: '123' });

      const createReply = new CreateReply({
        commentId: '123',
        content: 'komen',
        owner: 'dicoding',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const createdReply = await replyRepositoryPostgres.createReply(createReply);
      const replies = await RepliesTableTestHelper.findRepliesById(createdReply.id);
      expect(replies).toHaveLength(1);
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: '123',
        content: createReply.content,
        owner: createReply.owner,
      }));
    });
  });

  describe('getRepliesByThreadId', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.getRepliesByThreadId('threadId')).rejects.toThrowError(NotFoundError);
    });

    it('should return replies correctly', async () => {
      const expectedResult = {
        comment_id: '123',
        content: 'reply',
        id: 'reply1',
        thread_id: 'thread1',
        username: 'dicoding',
      };

      const createdReply = await RepliesTableTestHelper.createReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread1');
      expect(replies).toHaveLength(1);
      expect(replies[0]).toEqual({ ...expectedResult, date: createdReply.date });
    });
  });

  describe('verifyReplyIsExist', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyExist('reply')).rejects.toThrowError(NotFoundError);
    });

    it('should resolve when reply is found', async () => {
      const createReply = new CreateReply({
        content: 'reply',
        commentId: 'comment1',
        threadId: 'thread1',
        owner: 'dicoding',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.createReply(createReply);
      await expect(replyRepositoryPostgres.verifyReplyExist('reply1')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when provided userId is not the reply owner', async () => {
      const commentId = '123';
      const replyId = '123';
      const userId = '123';
      const wrongUser = 'dicoding';
      await UsersTableTestHelper.addUser({ id: '123' });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: userId,
        commentId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, wrongUser)).rejects.toThrowError(AuthorizationError);
    });

    it('should verify the reply owner correctly', async () => {
      const commentId = '123';
      const replyId = '123';
      const userId = '123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: userId,
        commentId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId)).resolves.not.toThrowError(AuthorizationError);
    });
  });


  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.deleteReplyById('id_delete')).rejects.toThrowError(NotFoundError);
    });

    it('should delete reply by id and return success correctly', async () => {
      const commentId = '123';
      const replyId = '123';
      await UsersTableTestHelper.addUser({ id: '123' });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await RepliesTableTestHelper.addReply({ id: replyId, owner: 'user-123', commentId });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReplyById(replyId);

      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });
});
