

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = '123',
    content = 'konten',
    owner = 'dicoding',
    commentId = '123',
    isDelete = 'false',
    date = 'date tes'
    
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, thread_id, owner, date',
      values: [id, content, owner, commentId, isDelete, date ]
    };

    const result = await pool.query(query);
    return result.rows[0];
  },


  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  }
};


module.exports = RepliesTableTestHelper;