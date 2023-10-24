const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }


  async postCommentHandler(request, h) {
    const { content } = request.payload;

    const { id: userId } = request.auth.credentials;

    const { threadId } = request.params;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
   
    const addedComment = await addCommentUseCase.execute({
      content, 
      owner: userId, 
      threadId
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      },
    });
    response.code(201);
    return response;
  }


  async deleteCommentByIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
   console.log('test');
    console.log(userId);

    const { threadId, commentId } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(
      {
         threadId, 
         commentId, 
         owner: userId 
      }
    );
  
    const response = h.response({ 
      status: 'success' 
    });
    return response;
  }
  

}

module.exports = CommentsHandler;