import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'moneytransfer',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server', err);
    return;
  }
  console.log('Connected to MySQL server');

  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error('Error starting transaction', transactionErr);
      connection.end();
      return;
    }

    const senderAccountNumber = 101;
    const receiverAccountNumber = 102;
    const amount = 3000.0;

    connection.query(
      'UPDATE account SET balance = balance - ? WHERE account_number = ?',
      [amount, senderAccountNumber],
      (updateSenderErr) => {
        if (updateSenderErr) {
          console.error('Error updating sender balance', updateSenderErr);
          connection.rollback(() => {
            console.log('Rolling back transaction');
            connection.end();
          });
          return;
        }

        connection.query(
          'UPDATE account SET balance = balance + ? WHERE account_number = ?',
          [amount, receiverAccountNumber],
          (updateReceiverErr) => {
            if (updateReceiverErr) {
              console.error(
                'Error updating receiver balance',
                updateReceiverErr,
              );
              connection.rollback(() => {
                console.log('Rolling back transaction');
                connection.end();
              });
              return;
            }

            connection.query(
              'INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)',
              [
                senderAccountNumber,
                amount,
                'Transfer from account 101 to account 102',
              ],
              (logSenderErr) => {
                if (logSenderErr) {
                  console.error(
                    'Error logging transfer from account 101 to account 102',
                    logSenderErr,
                  );
                  connection.rollback(() => {
                    console.log('Rolling back transaction');
                    connection.end();
                  });
                  return;
                }

                connection.query(
                  'INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)',
                  [
                    receiverAccountNumber,
                    amount,
                    'Transfer from account 102 to account 101',
                  ],
                  (logReceiverErr) => {
                    if (logReceiverErr) {
                      console.error(
                        'Error logging transfer from account 102 to account 101',
                        logReceiverErr,
                      );
                      connection.rollback(() => {
                        console.log('Rolling back transaction');
                        connection.end();
                      });
                      return;
                    }

                    connection.commit((commitErr) => {
                      if (commitErr) {
                        console.error(
                          'Error committing transaction',
                          commitErr,
                        );
                        connection.rollback(() => {
                          console.log('Rolling back transaction');
                          connection.end();
                        });
                      } else {
                        console.log('Transaction committed');
                        connection.end();
                      }
                    });
                  },
                );
              },
            );
          },
        );
      },
    );
  });
});
