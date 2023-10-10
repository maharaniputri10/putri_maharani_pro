class DeleteCommentUseCase {
    constructor({ 
      commentRepository, threadRepository 
    }) {
      this.commentRepository = commentRepository;
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      await this.threadRepository.verifyThreadIsExist(useCasePayload.threadId);
      await this.commentRepository.verifyCommentIsExist(useCasePayload.commentId);
      await this.commentRepository.verifyCommentOwner(useCasePayload.commentId,useCasePayload.owner);
      await this.commentRepository.deleteCommentById(useCasePayload.commentId);
    }
  }
  

module.exports = DeleteCommentUseCase;