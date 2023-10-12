const CreateReply = require('../../Domains/replies/entities/CreateReply');


class AddReplyUseCase {
    constructor({ commentRepository, threadRepository, replyRepository }) {
      this.commentRepository = commentRepository;
      this.threadRepository = threadRepository;
      this.replyRepository = replyRepository;
    }
  
    async execute(useCasePayload) {
      const createReply = new CreateReply (useCasePayload);
      await this.threadRepository.verifyThreadExist(useCasePayload.threadId);
      await this.commentRepository.verifyCommentIsExist(useCasePayload.commentId);
      await this.replyRepository.createReply(createReply);
    }


  }
  
  module.exports = AddReplyUseCase;
  