import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://anarip62:iphone3958@cluster0.6xcx6k0.mongodb.net/?retryWrites=true&w=majority';

const dbName = 'moneytransfer';
const collectionName = 'transactions';

export async function transferMoney(
  fromAccountNumber,
  toAccountNumber,
  amount,
  remark,
) {
  const client = new MongoClient(uri);
  let session;

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    session = client.startSession();
    session.startTransaction();

    const fromAccount = await collection.findOne({
      account_number: fromAccountNumber,
    });
    const toAccount = await collection.findOne({
      account_number: toAccountNumber,
    });

    if (!fromAccount || !toAccount || fromAccount.balance < amount) {
      throw new Error('Insufficient balance or invalid account number.');
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    const fromChangeNumber = fromAccount.account_changes.length;
    const toChangeNumber = toAccount.account_changes.length;

    fromAccount.account_changes.push({
      change_number: fromChangeNumber + 1,
      amount: -amount,
      changed_date: new Date(),
      remark,
    });

    toAccount.account_changes.push({
      change_number: toChangeNumber + 1,
      amount,
      changed_date: new Date(),
      remark,
    });

    await collection.updateOne(
      { account_number: fromAccountNumber },
      { $set: fromAccount },
    );
    await collection.updateOne(
      { account_number: toAccountNumber },
      { $set: toAccount },
    );

    await session.commitTransaction();
    console.log('Money transfer successful.');
  } catch (err) {
    console.error('Error:', err);
    await session.abortTransaction();
  } finally {
    session.endSession();
    client.close();
  }
}
