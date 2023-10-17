const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');



describe('AddCommentUseCase', () => {
      
  it('should orchestrating the create comment action correctly', async () => {
        const useCasePayload = {
            content: 'ini content',
            owner: 'user-123',
            threadId: 'thread-123'
          };

        const mockAddedComment = new CreatedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
          });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyThreadIsExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.createComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve(new CreatedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          owner: useCasePayload.owner
        })));


        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
          });


        const addedComment = await addCommentUseCase.execute(useCasePayload);


        expect(addedComment).toStrictEqual(
          mockAddedComment
        );

        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(
          useCasePayload.threadId,
        );

        expect(mockCommentRepository.createComment).toBeCalledWith(
          new CreateComment({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            threadId: useCasePayload.threadId
        }));
      });
  });