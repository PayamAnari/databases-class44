import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://anarip62:iphone3958@cluster0.6xcx6k0.mongodb.net/?retryWrites=true&w=majority';

const dbName = 'databaseWeek4';
const country = 'Albania';

async function totalPopulation() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('population');

    const pipeline = [
      {
        $match: { Country: country },
      },
      {
        $group: {
          _id: '$Year',
          countPopulation: {
            $sum: { $add: ['$M', '$F'] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.close();
  }
}
totalPopulation()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
