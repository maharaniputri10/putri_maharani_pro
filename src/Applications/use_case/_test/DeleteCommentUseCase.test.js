const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');


describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    
    
    const addDeleteUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    await addDeleteUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId, 
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});