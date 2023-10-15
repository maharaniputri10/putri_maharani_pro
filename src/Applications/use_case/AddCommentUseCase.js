const CreateComment = require('../../Domains/comments/entities/CreateComment');


class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
      this._threadRepository = threadRepository;
      this._commentRepository = commentRepository;
      
    }
  
    async execute(useCasePayload) {
      const createComment = new CreateComment (useCasePayload);
      await this._threadRepository.verifyThreadIsExist(useCasePayload.threadId);
      return this._commentRepository.createComment(createComment);
    }
 
  }
  
  module.exports = AddCommentUseCase;
  