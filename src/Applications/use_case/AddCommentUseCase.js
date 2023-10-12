const CreateComment = require('../../Domains/comments/entities/CreateComment');


class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
      this.commentRepository = commentRepository;
      this.threadRepository = threadRepository;
    }
  
    async execute(useCasePayload) {
      const createComment = new CreateComment (useCasePayload);
      await this.threadRepository.verifyThreadIsExist(useCasePayload.threadId);
      await this.commentRepository.createComment(createComment);
    }
 
  }
  
  module.exports = AddCommentUseCase;
  