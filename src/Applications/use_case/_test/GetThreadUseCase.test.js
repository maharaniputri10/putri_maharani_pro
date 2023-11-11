const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly with comment', async () => {
    const useCasePayload = 'thread-123';
    const date = new Date();

    const mockThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'user-123',
        date: date
    };

    const mockComment = [
      { 
        id: 'comment-123', 
        username: 'user-123', 
        date: date,
        content: 'content', 
        is_delete: false 
      },
      {
        id: 'comment-456',
        username: 'user-123',
        date: date,
        content: 'Cukup OKe',
        is_delete: true
      },
    ];

    const mockReply = [
      {
        id: 'reply-123',
        content: 'content',
        date: date,
        username: 'user-123',
        is_delete: false,
        comment_id: 'comment-123' 
      },
      {
        id: 'reply-456',
        content: 'cukup OKe',
        date: date,
        username: 'user-123',
        is_delete: true,
        comment_id: 'comment-123',
      },
    ];

    const mockGetDetails ={
        id: 'thread-123',
        title: 'title',
        body: 'body',
         date: date,
        
        username: 'user-123',
        comments: [
          {
            id: 'comment-123',
            username: 'user-123',
            date: date,
            
            replies: [
              {
                id: 'reply-123',
                content: 'content',
                 date: date,
                
                username: 'user-123',
              },
              {
                id: 'reply-456',
                content: '**balasan telah dihapus**',
                 date: date,
                
                username: 'user-123'
              },
            ],
            content: 'content',
            likeCount: 1
          },
            {
              id: 'comment-456',
              username: 'user-123',
              date: date,
              replies: [],
              content: '**komentar telah dihapus**',
              likeCount: 1
            },
        ],
    }

    
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));
    mockLikeRepository.getLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));

    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });


    const threads = await getThreadUseCase.execute(useCasePayload);


    expect(threads).toEqual(mockGetDetails);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.getLikeCount).toBeCalledWith('comment-123');
    expect(mockLikeRepository.getLikeCount).toBeCalledWith('comment-456');
  });
});