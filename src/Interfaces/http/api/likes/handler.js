const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const likeCommentUseCase = this._container.getInstance(
    LikeCommentUseCase.name
    );

    await likeCommentUseCase.execute({ 
      threadId, 
      commentId,
      owner: userId,
    });

    const response = h.response({ 
      status: 'success' 
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;