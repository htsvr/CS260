const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const scoreCollection = db.collection('session');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

async function addSession(session) {
  const result = await scoreCollection.insertOne(session);
  return result;
}

function getSessions() {
  const cursor = scoreCollection.find();
  return cursor.toArray();
}

function endSession(username, timeEnded) {
  const query = {ended: {$eq: false}, user: {$eq: username}};
  const update = {$set: {"ended": true}};
  scoreCollection.updateMany(
    // Match all documents
    query,
    // MongoDB 4.2+ can use an aggregation pipeline for updates
    [{
        $set: {
            "timeElapsed": {"$subtract": [timeEnded, "$timeStarted"]}
        }
    }]
  )
  scoreCollection.updateMany(query, update);
}

module.exports = { addSession, getSessions, endSession};