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
    return;
  }
  console.log('Connecting to MySQL server');

  const createAccountTable = `
  CREATE TABLE IF NOT EXISTS account (
    account_number INT PRIMARY KEY AUTO_INCREMENT,
    balance DECIMAL(10, 2) DEFAULT 0.00

  )
  `;

  const createAccountChangesTable = `
  CREATE TABLE IF NOT EXISTS account_changes (
    change_number INT PRIMARY KEY AUTO_INCREMENT,
    account_number INT,
    amount DECIMAL(10, 2),
    change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    remark VARCHAR(225),
    FOREIGN KEY (account_number) REFERENCES account(account_number)

  )
  `;
  connection.query(createAccountTable, (err1) => {
    if (err1) {
      console.log('Error creating account table', err1);
    } else {
      console.log('Created account table');
    }

    connection.query(createAccountChangesTable, (err2) => {
      if (err2) {
        console.log('Error creating account changes table', err2);
      } else {
        console.log('Created account_changes table');
      }

      connection.end();
    });
  });
});
