

const ShowThreadUseCase = require('../../../../Applications/use_case/ShowThreadUseCase');
const ThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');


class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }


  async postThreadHandler(request, h) {
    const { title, body } = request.payload;
    const { id } = request.auth.credentials;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread({ title, body,owner:id});

    const response = h.response({
      status: 'success',
      data: {addedThread}
    });
    response.code(201);
    return response;
  }


  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.getThreadDetailsById(threadId);

    return {
      status: 'success',
      data: {thread}
};
  }
}

module.exports = ThreadsHandler;