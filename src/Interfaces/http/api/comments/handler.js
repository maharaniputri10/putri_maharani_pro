const CommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);

  }

  async postCommentHandler(request, h) {
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment({ content, threadId, owner });


    const response = h.response({
      status: 'success',
      data: {addedComment},
    });
    response.code(201);
    return response;
  }


  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { commentId, threadId } = request.params;
    const commentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await commentUseCase.deleteCommentById({ commentId, threadId, owner });
  
    const response = h.response({ status: 'success' });
    return response;
  }
  

}

module.exports = CommentsHandler;