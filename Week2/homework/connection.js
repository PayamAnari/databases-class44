import mysql from 'mysql';
import util from 'util';

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'info',
});
connection.query = util.promisify(connection.query);

export default connection;
