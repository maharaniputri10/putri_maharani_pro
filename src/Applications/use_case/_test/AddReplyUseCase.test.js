const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');


describe('AddReplyUseCase', () => {

        it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
                commentId: '123',
                content: 'komen',
                owner: 'dicoding'
        };

        const expectedAddedReply = new CreatedReply({
            id: '123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
          });

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.createReply = jest.fn().mockImplementation(() => Promise.resolve(new CreatedReply({
          id: '123',
          content: useCasePayload.content,
          owner: useCasePayload.owner
        })));

        const addReplyUseCase = new AddReplyUseCase({
                replyRepository: mockReplyRepository,
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
        });
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.createReply).toBeCalledWith(new CreateReply({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            commentId: useCasePayload.commentId
        }));
      });

});
    