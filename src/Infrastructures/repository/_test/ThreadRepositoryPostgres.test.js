const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');


describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('addThread function', () => {
    it('should persist add thread and return created thread correctly', async () => {
        await UsersTableTestHelper.addUser(
          { id: 'user-123' }
        );
        const createThread = new CreateThread({
        title: 'this is title',
        body: 'Dicoding Indo',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; 
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const createdThread = await threadRepositoryPostgres.createThread(createThread);
      const threads = await ThreadsTableTestHelper.findThreadsById(createdThread.id);
      expect(threads).toHaveLength(1);
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: createThread.title,
        owner: createThread.owner
      }));
    });
  });


  describe('verifyThreadIsExist function', () => {
   
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      return expect(threadRepositoryPostgres.verifyThreadIsExist('thread-123')).rejects.toThrowError(NotFoundError);
  });

    it('should not throw NotFoundError found', async () => {
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser(
        { id: 'user-123' }
      );
      await ThreadsTableTestHelper.addThread(
        { id: threadId }
      );

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      return expect(threadRepositoryPostgres.getThreadById(threadId)).resolves.not.toThrowError(NotFoundError);
    });
  });


  describe('getThreadById funtion' , () => {
    it('should throw NotFoundError when thread not found', () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      return expect(threadRepositoryPostgres.getThreadById('hello')).rejects.toThrowError(NotFoundError);
    });


    it('should get thread by thread ID correctly', async () => {
     
      const threadData = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Dicoding Indo',
        owner: 'user-123',
        date: 'data palsu',
      };
      const userData = {
        id: 'user-123',
        username: 'dicoding',
      };

      await UsersTableTestHelper.addUser(userData);
      await ThreadsTableTestHelper.addThread(threadData);

      const fakeIdGenerator = () => '123'; 

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const thread = await threadRepositoryPostgres.getThreadById(threadData.id);
      expect(thread).toBeDefined();

      expect(thread.id).toEqual(threadData.id);
      expect(thread.title).toEqual(threadData.title);
      expect(thread.body).toEqual(threadData.body);
      expect(thread.date).toEqual(threadData.date);
      expect(thread.username).toEqual(userData.username);
      
    });
  });
});