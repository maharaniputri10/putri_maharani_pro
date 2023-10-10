const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {

    it('should orchestrating the add thread action correctly', async () => {
      const useCasePayload = {
            title: 'title',
            body: 'body',
            owner: 'dicoding'
      };

      const expectedAddedThread = new CreatedThread({
        id: '123',
        title: useCasePayload.title,
        owner: useCasePayload.owner
      });

      const mockThreadRepository = new ThreadRepository();
      mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve(new CreatedThread({
        id: '123',
        title: useCasePayload.title,
        owner: useCasePayload.owner
      })));

      const addThreadUseCase = new AddThreadUseCase
      ({threadRepository: mockThreadRepository});
      const addedThread = await addThreadUseCase.execute(useCasePayload);
      expect(addedThread).toStrictEqual(expectedAddedThread);
      expect(mockThreadRepository.createThread).toBeCalledWith(new CreateThread({
        title: useCasePayload.title, body: useCasePayload.body, owner: useCasePayload.owner
      }));
    });


});