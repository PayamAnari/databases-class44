import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'moneytransfer',
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL server', err);
  } else {
    console.log('Connected to MySQL server');
  }

  const insertSampleAccounts = `
  INSERT INTO account (account_number, balance)
  VALUES
   (101, 3000.00),
   (102, 6000.00)
  `;

  connection.query(insertSampleAccounts, (err1) => {
    if (err1) {
      console.log('Error inserting sample accounts', err1);
    } else {
      console.log('Inserted sample accounts');
    }

    connection.end();
  });
});
