const ThreadRepository = require('../ThreadRepository');


describe('ThreadRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const threadRepo =  new ThreadRepository();
        await expect(threadRepo.createThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadRepo.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadRepo.verifyThreadIsExist('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});