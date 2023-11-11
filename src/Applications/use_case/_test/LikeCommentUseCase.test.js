const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');


describe('LikeCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('add like action correctly if like not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExist = jest
    .fn()
    .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExist = jest
    .fn()
    .mockImplementation(() => Promise.resolve());

    mockLikeRepository.verifyIsLikeExists = jest
    .fn()
    .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.createLike = jest
    .fn()
    .mockImplementation(() => Promise.resolve());


    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyIsLikeExists).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.createLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('if like already exist', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyIsLikeExists = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await likeCommentUseCase.execute(useCasePayload);
    expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyIsLikeExists).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});