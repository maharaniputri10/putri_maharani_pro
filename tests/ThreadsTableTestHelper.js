const pool = require('../src/Infrastructures/database/postgres/pool');


const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread1',
    title = 'judul',
    body = 'isi',
    owner = 'user1'
  })
  
  {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, title, body, owner]
    };

    const result = await pool.query(query);
    return result.rows[0];
  },


  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },


  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  }
};


module.exports = ThreadsTableTestHelper;