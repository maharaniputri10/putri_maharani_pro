const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const ReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');


class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }


  async postReplyHandler(request, h) {
    const { content } = request.payload;
    const { id: userId } = request.auth.credentials;
   
    const { threadId, commentId } = request.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.addReply({content,threadId,commentId,owner: userId});

    const response = h.response({
      status: 'success',
      data: {addedReply}
    });
    response.code(201);
    return response;
  }


  async deleteReplyByIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { replyId, threadId, commentId } = request.params;
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    await replyUseCase.deleteReply({replyId,threadId,commentId,owner: userId});

    const response = h.response({status: 'success'});
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;