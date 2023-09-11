import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const dbName = 'moneytransfer';
const collectionName = 'transactions';

export async function setup() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});

    const accounts = [
      {
        account_number: 101,
        balance: 1000,
        account_changes: [],
      },
      {
        account_number: 102,
        balance: 2000,
        account_changes: [],
      },
    ];

    await collection.insertMany(accounts);
    console.log('Data inserted');
  } catch (error) {
    console.error('Error', error);
  } finally {
    client.close();
    console.log('Connection closed');
  }
}
