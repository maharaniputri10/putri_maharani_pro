

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = '123',
    content = 'content',
    owner = 'dicoding',
    threadId = '123',
    isDelete = false,
    date = 'date tes'
    
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner,  thread_id, date',
      values: [id, content, owner, threadId, isDelete, date]
    };

    const result = await pool.query(query);
    return result.rows[0];
  },


  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;