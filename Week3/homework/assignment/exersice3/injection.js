import mysql from 'mysql';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'new_world',
});

function getPopulation(country, name, code, cb) {
  pool.getConnection((err, conn) => {
    if (err) {
      cb(err);
      return;
    }

    const sql = 'SELECT Population FROM ?? WHERE Name = ? AND CountryCode = ?';

    conn.query(sql, [country, name, code], (queryErr, result) => {
      conn.release();

      if (queryErr) {
        cb(queryErr);
        return;
      }

      if (result.length === 0) {
        cb(new Error('Not found'));
      } else {
        cb(null, result[0].Population);
      }
    });
  });
}

getPopulation('city', 'amsterdam', 'NLD', (err, population) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Population:', population);
  }
});
