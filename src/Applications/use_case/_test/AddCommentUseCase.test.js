const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');


describe('AddCommentUseCase', () => {
      
  it('should orchestrating the create comment action correctly', async () => {
        const useCasePayload = {
            content: 'ini komentar',
            owner: 'dicoding',
            threadId: '123'
          };

        const expectedAddedComment = new CreatedComment({
            id: '123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
          });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.createComment = jest.fn().mockImplementation(() => Promise.resolve(new CreatedComment({
          id: '123',
          content: useCasePayload.content,
          owner: useCasePayload.owner })));

        const addcommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
          });

        const addedComment = await addCommentUseCase.execute(useCasePayload);

        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.createComment).toBeCalledWith(new CreateComment({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            threadId: useCasePayload.threadId
        }));
      });
    });