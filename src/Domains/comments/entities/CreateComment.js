class CreateComment {
    constructor(payload) {
      this._verifyPayload(payload);
      const { threadId, content, owner } = payload;
      this.threadId = threadId;
      this.content = content;
      this.owner = owner;
    }
  
    _verifyPayload({ thread_id, content, owner }) {
      if (!thread_id || !content || !owner) {
        throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
      if (typeof thread_id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
        throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = CreateComment;
  