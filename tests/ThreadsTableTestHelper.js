const pool = require('../src/Infrastructures/database/postgres/pool');
/**put
*/

const ThreadsTableTestHelper = {
  async addThread({
    id = '123',
    title = 'title',
    body = 'body',
    owner = 'dicoding'
  })
  
  {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, title, body, owner, date]
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