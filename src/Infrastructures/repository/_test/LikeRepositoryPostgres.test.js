const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');


describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('createLike function', () => {
    it('should persist create like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.createLike(payload.commentId, payload.owner);

      // Assert
      const likes = await LikesTableTestHelper
        .findLikesByCommentIdAndOwner(payload.commentId, payload.owner);
      expect(likes).toHaveLength(1);
    });
  });


  describe('verifyIsLikeExists function', () => {
    it('should return false if like not exists', async () => {
      // Arrange
      const userId = 'user-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      
      await LikesTableTestHelper.addLike({ commentId, owner: userId });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isExists = await likeRepositoryPostgres.verifyIsLikeExists(commentId, userId);

      // Assert
      expect(isExists).toBeDefined();
      expect(isExists).toStrictEqual(true);
    });


    it('should return FALSE if like does not exist', async () => {
      
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const isExists = await likeRepositoryPostgres.verifyIsLikeExists('comment-123', 'user-123');

      expect(isExists).toBeDefined();
      expect(isExists).toStrictEqual(false);
    });
  });


  describe('deleteLike function', () => {
    it('should delete like', async () => {
      // Arrange
      const userId = 'user-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
     
      await LikesTableTestHelper.addLike(
        { 
          commentId,
          owner: userId 
        }
      );
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.deleteLike(commentId, userId);

      // Assert
      const likes = await LikesTableTestHelper.findLikesByCommentIdAndOwner(commentId, userId);
      expect(likes).toHaveLength(0);
    });
  });


  describe('getLikeCount function', () => {
    it('should like count', async () => {
      // Arrange
      const userId = 'user-123';
      const commentId = 'comment-123';
     
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
     
      await LikesTableTestHelper.addLike(
        { 
          commentId, 
          owner: userId 
        }
      );
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCount(commentId);

      // Assert
      expect(likeCount).toBeDefined();
      expect(likeCount).toEqual(1);
    });
  });
});