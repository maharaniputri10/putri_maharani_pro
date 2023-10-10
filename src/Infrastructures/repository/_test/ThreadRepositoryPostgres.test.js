const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');


describe('ThreadRepositoryPostgres', () => {

  beforeEach(async () => {
    await UsersTableTestHelper.createUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });


  describe('addThread function', () => {
    it('should persist add thread and return created thread correctly', async () => {
      
        await UsersTableTestHelper.addUser({ id: 'user1' });
        const createThread = new CreateThread({
        title: 'thread judul',
        body: 'konten',
        owner: 'user1',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator);
      await threadRepositoryPostgres.createThread(createThread);
      const createdthreads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(createdthreads).toHaveLength(1);
    });


    it('should return created thread correctly', async () => {
      const createThread = new CreateThread({
        title: 'judul',
        body: 'konten',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator);
      const createdThread = await threadRepositoryPostgres.createThread(createThread);
      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: 'thread1',
          title: 'judul',
          owner: 'user1'
        }));
    });
  });

  describe('verifyThreadIsExist function', () => {
   
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThreadExist('thread3'))
      .rejects.toThrowError(NotFoundError);
    });

    it('should resolved when thread is found', async () => {
      const createThread = new CreateThread({
        title: 'judul',
        body: 'isi',
        owner: 'user1'
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator);
      await threadRepositoryPostgres.createThread(createThread);
      await expect(threadRepositoryPostgres.verifyThreadExist('thread1'))
      .resolves.not.toThrowError(NotFoundError);
    });
  });


  describe('getThreadById', () => {
    
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreadById('thread1'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      const expectedResult = await ThreadsTableTestHelper.createThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threads = await threadRepositoryPostgres.getThreadById('thread1');

      expect(threads).toEqual({
        id: 'thread1',
        title: 'judul',
        body: 'isi',
        username: 'ini user',
        date: expectedResult.date
      });
    });
  });

 

});