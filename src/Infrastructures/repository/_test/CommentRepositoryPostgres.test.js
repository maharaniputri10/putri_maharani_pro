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
    it('should persist create comment or return created comment correctly', async () => {
      await UsersTableTestHelper.addUser(
        {id: 'user-123'}
      );

      await ThreadsTableTestHelper.addThread(
        {id: 'thread-123'}
      );
      const createComment = new CreateComment({
        content: 'Dicod Indo',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, fakeIdGenerator
      );
      const createdComment = await commentRepositoryPostgres.createComment(createComment);
      const comments = await CommentsTableTestHelper.findCommentsById(createdComment.id);
      expect(comments).toHaveLength(1);
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: createComment.content,
        owner: createComment.owner
      }));
    });
  });

  describe('verifyCommentIsExist function', () => {

    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      return expect(
        commentRepositoryPostgres.verifyCommentIsExist('hello')
      ).rejects.toThrowError(NotFoundError);
    });


     it('should not throw NotFoundError when comment found', async () => {
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      ); 

      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      ); 

      await CommentsTableTestHelper.addComment(
        { id: commentId }
      );
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      return expect(commentRepositoryPostgres.verifyCommentIsExist(commentId)).resolves.not.toThrowError(NotFoundError);
    });
  });


  describe('verifyCommentOwner function', () => {
    it('should throw UnAuthorizationError when provided userId is not the comment owner', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const wrongId = 'user-321';
      await UsersTableTestHelper.addUser(
        { id: userId }
      );
      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      );
      await CommentsTableTestHelper.addComment(
        { id: commentId }
      );
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      expect(commentRepositoryPostgres.verifyCommentOwner(commentId, wrongId)).rejects.toThrowError(AuthorizationError);
    });


    it('should verify the comment owner correctly', async () => {
      const commentId = 'comment-123';

      const userId = 'user-123';

      await UsersTableTestHelper.addUser(
        { id: userId}
      );
      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      );
      await CommentsTableTestHelper.addComment(
        { id: commentId }
      );

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const kommen = CommentsTableTestHelper.findCommentsById(commentId);
      console.log(kommen);

      expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId)).resolves.not.toThrowError(AuthorizationError);
    
    });
  });


  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      return expect(commentRepositoryPostgres.deleteCommentById
        ('hello')).rejects.toThrowError(NotFoundError);
    });

    it('should delete commentById and return success correctly', async () => {
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      );
      await ThreadsTableTestHelper.addThread(
        { id: 'thread-123' }
      );
      await CommentsTableTestHelper.addComment(
        { id: commentId }
      );

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      await commentRepositoryPostgres.deleteCommentById(commentId);
      
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });


  describe('getCommentByThreadId function', () => {
    it('get comments by threadId', async () => {
      const threadId = 'thread-123';
      const date = new Date();
      const date2 = new date();

      await UsersTableTestHelper.addUser({
         id: 'user-123' 
      }); 

      await ThreadsTableTestHelper.addThread({
         id: threadId 
      });

      await CommentsTableTestHelper.addComment(
        {
        id: 'comment-123',
        threadId,
        date: date,
        }
      );

      await CommentsTableTestHelper.addComment(
        {
        id: 'comment-321',
        threadId,
        date: date2,
        }
      );

       const commen = CommentsTableTestHelper.findCommentsById(threadId);
       console.log(commen);

      const fakeIdGenerator = () => '123';
     
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comments = await commentRepositoryPostgres
      .getCommentsByThreadId(threadId);

      expect(comments).toBeDefined();
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual(
        'comment-123'
      );
      expect(comments[0].date).toEqual(
         date
      );
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].content).toEqual('dicoding'); 
      expect(comments[0].is_delete).toEqual(false);

      expect(comments[1].id).toEqual('comment-321');
      expect(comments[1].date).toEqual(date);
     
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].content).toEqual('dicoding'); 
      expect(comments[1].is_delete).toEqual(false); 
   
    });


    it('should empty array if comment not found', async () => {
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      ); 
      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );

      const fakeIdGenerator = () => '123'; 

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(0);
    });
  });
});
