const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');


describe('DeleteReplyUseCase', () => {

  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = { 
      threadId: 'thread-123', 
      commentId: 'comment-123',
       replyId: 'reply-123', 
       owner: 'dicoding-123' 
      };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();


    mockReplyRepository.verifyReplyIsExist = jest
    .fn()
    .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
    .fn()
    .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
    .fn()
    .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadIsExist = jest
    .fn()
    .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExist = jest
    .fn()
    .mockImplementation(() => Promise.resolve());
   
    const addDeleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    await addDeleteReplyUseCase.execute(useCasePayload);

    expect(mockReplyRepository.verifyReplyIsExist).toBeCalledWith(
      useCasePayload.replyId,
      );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.replyId, 
      useCasePayload.owner,
      );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      useCasePayload.replyId,
      );
    expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(
      useCasePayload.threadId,
      );
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(
      useCasePayload.commentId,
      );
   
  });


});