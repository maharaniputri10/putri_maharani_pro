const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');


describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user1',
      username: 'iniUser'
    });
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      
      await UsersTableTestHelper.addUser({ id: 'user1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread1' }); 
      
        const createComment = new CreateComment({
        threadId: 'thread1',
        content: 'Comment',
        owner: 'user1',
      });
      const fakeIdGenerator = () => '123';//stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,fakeIdGenerator);
      await commentRepositoryPostgres.addComment(createComment);

      const comments = await CommentsTableTestHelper.findCommentsById(createdComment.id);
      expect(comments).toHaveLength(1);
      expect(createdComment).toStrictEqual(new CreatedComment({
            id: 'comment1',
            content: createComment.content,
            owner: createComment.owner
        }));
    });


    it('should return created comment correctly', async () => {
      const newComment = new NewComment({
        threadId: 'thread1',
        content: 'comment',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,fakeIdGenerator);
      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      expect(createdComment).toStrictEqual(
        new CreatedComment({
          id: 'comment1',
          content: 'comment',
          owner: 'user1',
        })
      );
    });
  });


  describe('getCommentById', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.getCommentById('comment-1234443')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment detail correctly', async () => {
      const expectedResult = {
        content: 'komentar',
        id: 'comment-123',
        thread_id: 'thread-123',
        username: 'SomeUser',
      };

      const addedComment = await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-123'
      );

      expect(comment).toEqual({ ...expectedResult, date: addedComment.date });
    });
  });


  describe('getCommentsByThreadId', () => {
    it('should return comment detail correctly', async () => {
      const expectedResult = {
        id: 'comment-123',
        content: 'komentar',
        username: 'SomeUser',
        is_delete: false,
      };

      const addedComment = await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      expect(comment).toHaveLength(1);
      expect(comment[0]).toStrictEqual({
        ...expectedResult,
        date: addedComment.date,
      });
    });
  });

  
  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      return expect(commentRepositoryPostgres.deleteCommentById('deleteIni')).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment by id and return success correctly', async () => {
      const commentId = 'comment1';
      await UsersTableTestHelper.addUser({ id: 'user1' }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread1' }); 
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteCommentById(commentId);

      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });


  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentExist('comments')).rejects.toThrowError(NotFoundError);
    });

    it('should resolved when comments is found', async () => {
      const createComment = new CreateComment({
        content: 'komentar',
        threadId: 'thread1',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,fakeIdGenerator);
      await commentRepositoryPostgres.addComment(CreateComment);

      await expect(
        commentRepositoryPostgres.verifyCommentExist('comment1')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when provided userId is not the comment owner', async () => {
      const commentId = 'comment1';
      const userId = 'user1';
      const wrongId = 'user4';
      await UsersTableTestHelper.addUser({ id: userId }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread1' });
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId,wrongId))
      .rejects.toThrowError(AuthorizationError);
    });

    it('should resolved when owner comment is the same with payload', async () => {
      const newComment = new NewComment({
        content: 'komentar',
        threadId: 'thread1',
        owner: 'user1',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool,fakeIdGenerator);
      await commentRepositoryPostgres.addComment(newComment);

      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment1',
          owner: 'user1',
        })).resolves.not.toThrowError(AuthorizationError);
    });

    it('should verify the comment owner correctly', async () => {
      const commentId = 'comment1';
      const userId = 'user1';
      await UsersTableTestHelper.addUser({ id: userId }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); 
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId)).resolves.not.toThrowError(AuthorizationError);
    });
  });
});