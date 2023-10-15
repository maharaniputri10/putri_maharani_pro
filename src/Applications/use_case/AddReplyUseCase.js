const CreateReply = require('../../Domains/replies/entities/CreateReply');


class AddReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
      this._threadRepository = threadRepository;
      this._commentRepository = commentRepository;
      this._replyRepository = replyRepository;
    }
  
    async execute(useCasePayload) {
      const createReply = new CreateReply (useCasePayload);
      await this._threadRepository.verifyThreadIsExist(useCasePayload.threadId);
      await this._commentRepository.verifyCommentIsExist(useCasePayload.commentId);
      return this._replyRepository.createReply(createReply);
    }


  }
  
  module.exports = AddReplyUseCase;
  