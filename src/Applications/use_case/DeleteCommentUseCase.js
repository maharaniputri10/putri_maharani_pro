class DeleteCommentUseCase {
  constructor({threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
   
  }

 
  async execute(useCasePayload) {
    //console.log(useCasePayload);
    await this._threadRepository.verifyThreadIsExist(useCasePayload.threadId);
    await this._commentRepository.verifyCommentIsExist(useCasePayload.commentId);
    await this._commentRepository.verifyCommentOwner(useCasePayload.commentId,useCasePayload.owner);
    await this._commentRepository.deleteCommentById(useCasePayload.commentId);
    
  }
  
}


module.exports = DeleteCommentUseCase;