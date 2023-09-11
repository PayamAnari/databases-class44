import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = 'databaseWeek4';
const collectionName = 'population';

async function getContinentInfo(year, age) {
  const client = new MongoClient(uri);
  const continentsToFilter = [
    'AFRICA',
    'ASIA',
    'EUROPE',
    'LATIN AMERICA AND THE CARIBBEAN',
    'NORTHERN AMERICA',
    'OCEANIA',
  ];

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = {
      Year: year,
      Age: age,
      Country: { $in: continentsToFilter },
    };
    const cursor = await collection.find(query);

    const result = await cursor.toArray();

    result.forEach((item) => {
      item.TotalPopulation = item.M + item.F;
    });

    return result;
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.close();
  }
}

const year = 2020;
const age = '100+';

getContinentInfo(year, age)
  .then((continentInfo) => {
    console.log(continentInfo);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
