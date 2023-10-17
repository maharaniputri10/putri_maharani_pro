const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');



describe('DeleteReplyUseCase', () => {

  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = { 
      threadId: 'thread-123', 
      commentId: 'comment-123',
      replyId: 'reply-123', 
      owner: 'user-123' 
    };

    
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    
    mockReplyRepository.verifyReplyIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
   
   
   
    const addDeleteUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
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

    expect(mockReplyRepository.verifyReplyIsExist).toBeCalledWith(
      useCasePayload.replyId,
    );

    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.replyId, 
      useCasePayload.owner
    );

    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      useCasePayload.replyId
    );  
  });
});