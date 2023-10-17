const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');


describe('AddReplyUseCase', () => {

        it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
          content: 'ini content',
          owner: 'user-123',
          commentId: 'comment-123'
          
        };

        const mockAddedReply = new CreatedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        });

        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyThreadIsExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentIsExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
        mockReplyRepository.createReply = jest
        .fn()
        .mockImplementation(() => Promise.resolve(new CreatedReply(
          {
          id: 'reply-123',
          content: useCasePayload.content,
          owner: useCasePayload.owner,
          }
        )));

        const addReplyUseCase = new AddReplyUseCase({ 
          commentRepository: mockCommentRepository,
          replyRepository: mockReplyRepository,
          threadRepository: mockThreadRepository,    
        });

        const addedReply = await addReplyUseCase.execute(useCasePayload);

        expect(addedReply).toStrictEqual(
          mockAddedReply
        );
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(
          useCasePayload.threadId,
        );
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(
          useCasePayload.commentId,
        );
        expect(mockReplyRepository.createReply).toBeCalledWith(
          new CreateReply({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            commentId: useCasePayload.commentId
        }));
    });
  });
    