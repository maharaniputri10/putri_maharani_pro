class DeleteReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository })  {
      this.threadRepository = threadRepository;
      this.commentRepository = commentRepository;
      this.replyRepository = replyRepository;
    }
  

    async execute(useCasePayload) {
      await this.threadRepository.verifyThreadIsExist(useCasePayload.threadId);
      await this.commentRepository.verifyCommentIsExist(useCasePayload.commentId);
      await this.replyRepository.verifyReplyIsExist(useCasePayload.replyId);
      await this.replyRepository.verifyReplyOwner(useCasePayload.replyId, useCasePayload.owner);
      await this.replyRepository.deleteReplyById(useCasePayload.replyId);
    }
  }
  

module.exports = DeleteReplyUseCase;