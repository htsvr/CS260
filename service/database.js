const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const scoreCollection = db.collection('session');
const userCollection = db.collection('user');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

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

module.exports = {
  getUser,
  getUserByToken,
  createUser, 
  addSession, 
  getSessions, 
  endSession};