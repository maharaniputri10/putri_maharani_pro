

const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');


class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }


  async createComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner, thread_id, date',
      values: [id, content, owner, threadId, date]
    };

    const result = await this._pool.query(query);
    return new CreatedComment({ ...result.rows[0] });
  }


  async getCommentsByThreadId(threadId) {
    const query = await this._pool.query({
      text: 
      `SELECT comments.id, content, users.username, date, is_delete 
      FROM comments INNER JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1 ORDER BY comments.date ASC`,
      values: [threadId]
    });
    const result = await this._pool.query(query);
    return result.rows;
  }


  async deleteCommentById({ commentId }) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id=$1',
      values: [commentId]
    };

    await this._pool.query(query);
  }


  async verifyCommentIsExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan!');
    }
  }


  async verifyCommentOwner({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner= $2',
      values: [commentId, owner]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError(`Anda tidak dapat mengakses komentar ini!`);
    }
  }
}





module.exports = CommentRepositoryPostgres;