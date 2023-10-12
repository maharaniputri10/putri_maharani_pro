class ShowThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this.threadRepository.getThreadById(useCasePayload);
    const comments = await this.commentRepository.getCommentsByThreadId(useCasePayload);
    const replies = await this.replyRepository.getRepliesByThreadId(useCasePayload);

    const validatedComments = this._validateDeletedComment(comments);
    const validatedReplies = this._validateDeletedReply(replies);
    const commentsAndReplies = this._addReplyToComment(validatedComments, validatedReplies);
    return commentsAndReplies;
  }

  _validateDeletedComment(comments) {
    for (const comment of comments) {
      if (comment.is_delete) {
        comment.content = 'comment dihapus';
      }
      delete comment.is_delete;
    }
    return comments;
  }

  _validateDeletedReply(replies) {
    for (const reply of replies) {
      if (reply.is_delete) {
        reply.content = 'balasan dihapus';
      }
      delete reply.is_delete;
    }
    return replies;
  }

  _addReplyToComment(comments, replies) {
    for (const comment of comments) {
      comment.replies = [];
      for (const reply of replies) {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
        }
        delete reply.comment_id;
      }
    }
    return comments;
  }
}

module.exports = ShowThreadUseCase;
