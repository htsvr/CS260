const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/sessions', async (_req, res) => {
  const sessions = await DB.getSessions();
  res.send(sessions);
});

// SubmitScore
apiRouter.post('/sessions/start', async (req, res) => {
  DB.addSession(req.body);
  const sessions = await DB.getSessions();
  res.send(sessions);
});

apiRouter.post('/sessions/end', async (req, res) => {
    DB.endSession(req.body.username, req.body.time);
    const sessions = await DB.getSessions();
    res.send(sessions);
  });

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// function endSession(username, endTime) {
//     sessions.forEach((session) => {
//         if (session.user == username && !session.ended){
//             session.timeElapsed = endTime - session.timeStarted;
//             session.ended = true;
//         }
//     });
// }