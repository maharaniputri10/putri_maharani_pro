const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');




class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }


  async createReply(newReply) {
    const { content, owner, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies(id, content, owner, comment_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, commentId, date],
    };

    const result = await this._pool.query(query);
    return new CreatedReply({ ...result.rows[0] });
  }


  async getReplyByThreadId(threadId) {
    const query = {
      text: `
        SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete, replies.comment_id
        FROM replies INNER JOIN users ON replies.owner = users.id INNER JOIN comments ON replies.comment_id = comments.id
        WHERE comments.thread_id = $1 ORDER BY replies.date ASC`,
        values: [threadId]
    };

    const result = await this._pool.query(query);

    return result.rows;
  }


 async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found!');
    }
  }


  async verifyReplyIsExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('oops, reply not found');
    }
  }


  async verifyReplyOwner({ replyId, owner }) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner= $2',
      values: [replyId, owner]
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('jangan coba2 ubah!');
    }
  }
}





module.exports = ReplyRepositoryPostgres;