const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');


describe('DeleteCommentUseCase', () => {

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: '123',
      commentId: '123',
      owner: 'dicoding'
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockCommentRepository.verifyCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    await deleteCommentUseCase.execute(useCasePayload);
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCasePayload.threadId);
  });

  
});