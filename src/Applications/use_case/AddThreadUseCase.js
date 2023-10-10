const CreateThread = require('../../Domains/threads/entities/CreateThread');


class AddThreadUseCase {
    constructor({
       threadRepository
    }) {
        this.threadRepository = threadRepository;
       }
  
    async execute(useCasePayload) {
      const createThread = new CreateThread (useCasePayload);
      return this.threadRepository.createThread(createThread);
    }
  
}
    

module.exports = AddThreadUseCase;