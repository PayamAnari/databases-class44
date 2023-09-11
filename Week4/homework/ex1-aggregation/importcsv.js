import express from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const port = process.env.PORT || 3000;

const uri =
  'mongodb+srv://anarip62:iphone3958@cluster0.6xcx6k0.mongodb.net/?retryWrites=true&w=majority';
const csvFilePath = './population_pyramid_1950-2022.csv';

async function importCsvToMongoDB() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    const database = client.db('databaseWeek4');
    const collection = database.collection('population');

    const csvReadStream = fs.createReadStream(csvFilePath);
    const csvParserStream = csvReadStream.pipe(csvParser());

    const insertPromises = [];

    csvParserStream.on('data', async (row) => {
      const document = {
        _id: new ObjectId(),
        Country: row.Country,
        Year: parseInt(row.Year),
        Age: row.Age,
        M: parseInt(row.M),
        F: parseInt(row.F),
      };

      insertPromises.push(collection.insertOne(document));
    });

    csvParserStream.on('end', async () => {
      try {
        await Promise.all(insertPromises);
        console.log('CSV file successfully imported to MongoDB');
      } catch (error) {
        console.error('Error inserting documents:', error);
      } finally {
        client.close();
        console.log('MongoDB connection closed');
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

app.get('/import-csv', (req, res) => {
  importCsvToMongoDB()
    .then(() => {
      res.send('CSV data import successful');
    })
    .catch((error) => {
      res.status(500).send(`Error: ${error.message}`);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
