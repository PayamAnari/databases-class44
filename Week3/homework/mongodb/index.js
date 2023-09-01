import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


import { seedDatabase } from './seedDatabase.js';

async function createEpisodeExercise(client) {
  
  const newEpisode = {
    episode: 'S09E13',
    title: 'MOUNTAIN HIDE-AWAY',
    elements: [
      'CIRRUS',
      'CLOUDS',
      'CONIFER',
      'DECIDIOUS',
      'GRASS',
      'MOUNTAIN',
      'MOUNTAINS',
      'RIVER',
      'SNOWY_MOUNTAIN',
      'TREE',
      'TREES',
    ],
  };

  
  const result = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .insertOne(newEpisode);

  console.log(
    `Created season 9 episode 13 and the document got the id ${result.insertedId}`,
  );
}

async function findEpisodesExercises(client) {
  
  const episode2Season2 = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .findOne({ episode: 'S02E02' });
  console.log(`The title of episode 2 in season 2 is ${episode2Season2.title}`);

  const blackRiverEpisode = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .findOne({ title: 'BLACK RIVER' });
  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${blackRiverEpisode.episode}`,
  );
}

async function updateEpisodeExercises(client) {
  const updateResult = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .updateOne({ episode: 'S30E13' }, { $set: { title: 'BLUE RIDGE FALLS' } });

  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${updateResult.modifiedCount} episodes`,
  );

  const updateManyResult = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .updateMany({ elements: 'BUSHES' }, { $set: { 'elements.$': 'BUSH' } });

  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${updateManyResult.modifiedCount} episodes`,
  );
}

async function deleteEpisodeExercise(client) {
  const deleteResult = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .deleteOne({ episode: 'S31E14' });

  console.log(
    `Ran a command to delete episode and it deleted ${deleteResult.deletedCount} episodes`,
  );
}

// ...

async function main() {
  if (process.env.MONGODB_URI == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`,
    );
  }
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    await seedDatabase(client);

    await createEpisodeExercise(client);

    await findEpisodesExercises(client);

    await updateEpisodeExercises(client);

    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}

main();
