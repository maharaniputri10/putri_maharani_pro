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
        await UsersTableTestHelper.addUser({ id: 'dicoding1' });
        const createThread = new CreateThread({
        title: 'title',
        body: 'body',
        owner: 'dicoding1',
      });
      const fakeIdGenerator = () => '123'; 
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const createdThread = await threadRepositoryPostgres.createThread(createThread);
      const threads = await ThreadsTableTestHelper.findThreadsById(createdThread.id);
      expect(threads).toHaveLength(1);
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: '123',
        title: createThread.title,
        owner: createThread.owner
      }));
    });
  });


  describe('verifyThreadIsExist function', () => {
   
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThreadExist('123')).rejects.toThrowError(NotFoundError);
    });

    it('should resolved when thread is found', async () => {
      const createThread = new CreateThread({
        title: 'title',
        body: 'body',
        owner: 'dicoding'
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator);
      await threadRepositoryPostgres.createThread(createThread);
      await expect(threadRepositoryPostgres.verifyThreadExist('123'))
      .resolves.not.toThrowError(NotFoundError);
    });
  });


  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreadById('123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      const expectedResult = await ThreadsTableTestHelper.createThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threads = await threadRepositoryPostgres.getThreadById('123');

      expect(threads).toEqual({
        id: '123',
        title: 'title',
        body: 'body',
        username: 'dicoding',
        date: expectedResult.date
      });
    });
  });

 

});