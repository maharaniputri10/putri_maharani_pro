const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');


describe('GetThreadUseCase', () => {
  it('should retrieve thread details with comments and replies correctly', async () => {
    // Prepare mock data and mock repositories
    const useCasePayload = 'thread-123';

    // Mocked expected data
    const expectedThreadDetails = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      username: 'dicoding-123',
      date: '2023-10-13T21:35:20.018Z'
    };

    const expectedComments = [
      { 
        id: 'comment-123', 
        username: 'dicoding-123', 
        date: '2023-10-13T21:35:20.018Z', 
        content: 'content', 
        is_delete: false 
      }
    ];

    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'content',
        date: '2023-10-13T21:35:20.018Z',
        username: 'dicoding-123',
        is_delete: false,
        comment_id: 'comment-123' 
      }
    ];

    const expectedGetThread ={
      id: 'thread-123',
      title: 'title',
      body: 'boody',
      date: '2023-10-13T21:35:20.018Z',
      username: 'dicoding-123',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding-123',
          date: '2023-10-13T21:35:20.018Z',
          replies: [
            {
              id: 'reply-123',
              content: 'content',
              date: '2023-10-13T21:35:20.018Z',
              username: 'dicoding-123',
            }
          ],
          content: 'content'
        }
      ],
    }

    // Mock the repositories and their methods
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest
    .fn()
    .mockResolvedValue(expectedThreadDetails);

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest
    .fn()
    .mockResolvedValue(expectedComments);

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getRepliesByThreadId = jest
    .fn()
    .mockResolvedValue(expectedReplies);

    // Initialize the use case
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    // Execute the use case
    const threadDetails = await getThreadUseCase.execute(useCasePayload);

    // results
    expect(getThread).toStrictEqual(expectedGetThread);
    expect(threadDetails).toEqual({
      thread: expectedThreadDetails,
      comments: expectedComments,
      replies: expectedReplies
    });
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
      );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
      );
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
      );
  });
});
