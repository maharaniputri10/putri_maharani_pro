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
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user1',
      username: 'user'
    });

    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {await pool.end();});


  describe('createReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user1' });
        await ThreadsTableTestHelper.addThread({ id: 'thread1' });
        await CommentsTableTestHelper.addComment({ id: 'comment1' });
     
        const createReply = new CreateReply({
        threadId: 'thread1',
        commentId: 'comment1',
        content: 'komen',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,fakeIdGenerato);
      await replyRepositoryPostgres.createReply(createReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply1');
      expect(replies).toHaveLength(1);
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply1',
        content: createReply.content,
        owner: createReply.owner
      }));
    });


    it('should return created reply correctly', async () => {
      const createReply = new CreateReply({
        threadId: 'thread1',
        commentId: 'comment1',
        content: 'komen',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,fakeIdGenerato);
      const createdReply = await replyRepositoryPostgres.createReply(createReply);

      expect(createdReply).toStrictEqual(
        new CreatedReply({
          id: 'reply1',
          content: 'komen',
          owner: 'user1',
        })
      );
    });
  });


  describe('getRepliesByThreadId', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.getReplyById('balas')).rejects.toThrowError(NotFoundError);
    });

    it('should return reply correctly', async () => {
      const expectedResult = {
        comment_id: 'comment1',
        content: 'reply',
        id: 'reply1',
        thread_id: 'thread1',
        username: 'ini user'
      };

      const createdReply = await RepliesTableTestHelper.createReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = await replyRepositoryPostgres.getReplyById('reply1');
      expect(reply).toEqual({...expectedResult,date: createdReply.date});
    });
  });


  describe('verifyReplyIsExist function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReplyExist('reply'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should resolved when reply is found', async () => {
      const createReply = new CreateReply({
        content: 'reply',
        commentId: 'comment1',
        threadId: 'thread1',
        owner: 'user'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,fakeIdGenerator);
      await replyRepositoryPostgres.createReply(createReply);
      await expect(replyRepositoryPostgres.verifyReplyExist('reply1')).resolves.not.toThrowError(NotFoundError);
    });
  });


  describe('verifyReplyOwner function', () => {
    it('should throw UnauthorizedError when provided userId is not the reply owner', async () => {
      await RepliesTableTestHelper.createReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply1',
          owner: 'user1'
        })).rejects.toThrowError(AuthorizationError);
    });

    it('should resolved when owner reply is the same with payload ', async () => {
      const createReply = new CreateReply({
        content: 'reply',
        commentId: 'comment1',
        threadId: 'thread1',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool,fakeIdGenerator);
      await replyRepositoryPostgres.createReply(createReply);

      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply-123',
          owner: 'user-123',
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });
  

  describe('getRepliesByCommentId', () => {
    it('should return reply correctly', async () => {
      const expectedResult = {
        id: 'reply1',
        comment_id: 'comment1',
        thread_id: 'thread1',
        content: 'komentar',
        username: 'ini user',
        is_delete: false  
      };

      const createdReply = await RepliesTableTestHelper.createReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = await replyRepositoryPostgres.getRepliesByCommentId('comment1');

      expect(reply).toHaveLength(1);
      expect(reply[0]).toStrictEqual({...expectedResult,date: createdReply.date
      });
    });
  });


  describe('deleteReply function', () => {
    it('should change is_delete to true from database', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.createReply({
        id: 'reply1',
        commentId: 'comment1',
        threadId: 'thread1',
        content: 'reply'
      });

      await replyRepositoryPostgres.verifyReplyOwner({
        replyId: 'reply1',
        owner: 'user1'
      });
      await replyRepositoryPostgres.deleteReply({
        replyId: 'reply1',
        commentId: 'comment1',
        threadId: 'thread1',
        owner: 'user1'
      });

      const reply = await RepliesTableTestHelper.findRepliesById('reply1');
      expect(reply[0].is_delete).toEqual(true);
    });
  });


 
});