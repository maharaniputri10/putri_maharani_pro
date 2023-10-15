const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');


describe('AddReplyUseCase', () => {

        it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
          threadId: 'thread-123',
          content: 'ini content',
          owner: 'dicoding-123',
          commentId: 'comment-123'
          
        };

        const mockAddedReply = new CreatedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner
          });

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadIsExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentIsExist = jest
        .fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.createReply = jest
        .fn().mockImplementation(() => Promise.resolve(mockAddedReply));

        const addReplyUseCase = new AddReplyUseCase({
                commentRepository: mockCommentRepository,
                replyRepository: mockReplyRepository,
                threadRepository: mockThreadRepository
        });
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        expect(addedReply).toStrictEqual(expectedAddedReply);

        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(
          useCasePayload.threadId,
          );
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(
          useCasePayload.commentId,
          );
        expect(mockReplyRepository.createReply).toBeCalledWith(
          new CreateReply({
            threadId: useCasePayload.threadId,
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            commentId: useCasePayload.commentId
        }),
        );
      });

});
    