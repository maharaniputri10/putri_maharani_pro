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
      await UsersTableTestHelper.addUser({id: '123'});
      await ThreadsTableTestHelper.addThread({id: '123'});
      const createComment = new CreateComment({
        threadId: '123',
        content: 'Comment',
        owner: 'dicoding'
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const createdComment = await commentRepositoryPostgres.addComment(createComment);
      const comments = await CommentsTableTestHelper.findCommentsById(createdComment.id);
      expect(comments).toHaveLength(1);
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: '123',
        content: createComment.content,
        owner: createComment.owner
      }));
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(
        commentRepositoryPostgres.verifyCommentExist('comments')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should resolve when comments are found', async () => {
      const createComment = new CreateComment({
        content: 'komentar',
        threadId: '123',
        owner: 'dicoding'
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(createComment);

      await expect(
        commentRepositoryPostgres.verifyCommentExist('123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when provided userId is not the comment owner', async () => {
      const commentId = '123';
      const userId = 'dicoding';
      const wrongId = 'test';
      await UsersTableTestHelper.addUser({ id: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: '123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, wrongId)).rejects.toThrowError(AuthorizationError);
    });

    it('should verify the comment owner correctly', async () => {
      const commentId = '231';
      const userId = 'dicoding';
      await UsersTableTestHelper.addUser({ id: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      expect(await commentRepositoryPostgres.verifyCommentOwner(commentId, userId)).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      return expect(commentRepositoryPostgres.deleteCommentById('comment')).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment by id and return success correctly', async () => {
      const commentId = 'comment';
      await UsersTableTestHelper.addUser({ id: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: '123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return comment detail correctly', async () => {
      const expectedResult = {
        id: '123',
        content: 'komentar',
        username: 'dicoding',
        is_delete: false,
      };
      const addedComment = await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = await commentRepositoryPostgres.getCommentsByThreadId('123');

      expect(comment).toHaveLength(1);
      expect(comment[0]).toStrictEqual({
        ...expectedResult,
        date: addedComment.date,
      });
    });
  });
});
