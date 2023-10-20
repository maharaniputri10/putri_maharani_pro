const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');


describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly with comment', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'user-123',
        date: new Date().toISOString(),
      };

    const mockComment = [
      { 
        id: 'comment-123', 
        username: 'user-123', 
        date: new Date().toISOString(),
        content: 'content', 
        is_delete: false 
      },
      {
        id: 'comment-456',
        username: 'user-123',
        date: new Date().toISOString(),
        content: 'Cukup OKe',
        is_delete: true
      },
    ];

    const mockReply = [
      {
        id: 'reply-123',
        content: 'content',
        date: new Date().toISOString(),
        username: 'user-123',
        is_delete: false,
        comment_id: 'comment-123' 
      },
      {
        id: 'reply-456',
        content: 'cukup OKe',
        date: new Date().toISOString(),
        username: 'user-123',
        is_delete: true,
        comment_id: 'comment-123',
      },
    ];

    const mockGetDetails ={
        id: 'thread-123',
        title: 'title',
        body: 'body',
         date: new Date().toISOString(),
        
        username: 'user-123',
        comments: [
          {
            id: 'comment-123',
            username: 'user-123',
             date: new Date().toISOString(),
            
            replies: [
              {
                id: 'reply-123',
                content: 'content',
                 date: new Date().toISOString(),
                
                username: 'user-123',
              },
              {
                id: 'reply-456',
                content: '**balasan telah dihapus**',
                 date: new Date().toISOString(),
                
                username: 'user-123'
              },
            ],
            content: 'content',
          },
            {
              id: 'comment-456',
              username: 'user-123',
              date: new Date().toISOString(),
              replies: [],
              content: '**komentar telah dihapus**'
            },
        ],
    }

    
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });


    const threads = await getThreadUseCase.execute(useCasePayload);


    expect(threads).toStrictEqual(mockGetDetails);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplyByThreadId).toBeCalledWith(useCasePayload);
  });
});