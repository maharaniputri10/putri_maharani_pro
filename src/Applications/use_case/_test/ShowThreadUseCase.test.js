const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('ShowThreadUseCase', () => {
  it('should retrieve thread details with comments and replies correctly', async () => {
    // Prepare mock data and mock repositories
    const useCasePayload = { threadId: '123' };
    // Mocked expected data
    const expectedThreadDetails = {
      id: '123',
      title: 'title Thread',
      owner: 'dicoding',
    };
    const expectedComments = [
      { id: 'comment1', content: 'Comment 1', replies: [] },
      { id: 'comment2', content: 'Comment 2', replies: [{ id: 'reply1', content: 'Reply 1' }] },
    ];
    const expectedReplies = [{ id: 'reply1', content: 'Reply 1' }];

    // Mock the repositories and their methods
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(expectedThreadDetails);
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(expectedComments);
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue(expectedReplies);

    // Initialize the use case
    const showThreadUseCase = new ShowThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Execute the use case
    const threadDetails = await showThreadUseCase.execute(useCasePayload);

    // results
    expect(threadDetails).toEqual({
      thread: expectedThreadDetails,
      comments: expectedComments,
      replies: expectedReplies,
    });
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
