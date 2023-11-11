class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
    console.log('put==================================================')
    console.log('like repository:', this._likeRepository);
  }


  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    console.log(comments);
    const replies = await this._replyRepository.getReplyByThreadId(useCasePayload);

    const validatedComments = this._validateDeletedComment(comments);
    const validatedReplies = this._validateDeletedReply(replies);
    
    const commentsReplies = this._addReplyToComment(validatedComments, validatedReplies);
    const likeCountComRep = await this._addLikeCountToComment(commentsReplies);
    return {...thread, comments: likeCountComRep };
    
  }


  _validateDeletedComment(comments) {
    for (const comment of comments) {
      if (comment.is_delete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
    }
    return comments;
  }


  _validateDeletedReply(replies) {
    for (const reply of replies) {
      if (reply.is_delete) {
        reply.content = '**balasan telah dihapus**';
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


  async _addLikeCountToComment(comments){
    console.log('put ======================================================')
    console.log('Entering _addLikeCountToComment');
    for (const comment of comments) {
      comment.likeCount = await this._likeRepository.getLikeCount(comment.id);
    }
    console.log('put ======================================================')
    console.log('Exiting _addLikeCountToComment');
    return comments;
  }
}

module.exports = GetThreadUseCase;