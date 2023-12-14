import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameNotifier } from '../track/gameNotifier';

export function Record({ username }) {
  const navigate = useNavigate();
  const [recHr, setRecHr] = React.useState(0);
  const [recMin, setRecMin] = React.useState(0);
  const [recSec, setRecSec] = React.useState(0);
  const [quote, setQuote] = React.useState({});

  React.useEffect(() => {
    getQuote();
  }, []);

  function handleRecord() {
    const ms = ((+recHr) * 60 * 60 + (+recMin) * 60 + (+recSec)) * 1000
    const newSession = { user: username, timeStarted: Date.now() - ms, timeElapsed: ms, ended: true };
    GlobSaveSession(newSession);
    GameNotifier.broadcastEvent(username, "AddBoiling", { timeStarted: Date.now() - ms, timeElapsed: ms });
    navigate('/track');
    window.location.reload(true);
  }

  async function GlobSaveSession(session) {
    const response = await fetch('/api/sessions/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(session),
    });
  }

  function getQuote(data) {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data);
        // document.querySelector('#quote').textContent = data.content;
        // document.querySelector('#author').textContent = "- " + data.author;
      });
  }

  return (
    <main>
      <div className='flexy'>
        <h3>Time Spent Boiling</h3>
        <div id="timeEntry">
          <input className="timeEntry" type="number" id="recHr" min="0" value={recHr} onChange={(e) => setRecHr(e.target.value)} />
          <span>hr </span>
          <input className="timeEntry" type="number" id="recMin" min="0" max="59" value={recMin} onChange={(e) => setRecMin(e.target.value)} />
          <span>min </span>
          <input className="timeEntry" type="number" id="recSec" min="0" max="59" value={recSec} onChange={(e) => setRecSec(e.target.value)} />
          <span>sec </span>
        </div>
        <button onClick={handleRecord}>Record</button>
      </div>
      <div className="quote">
        <p id="quote">{quote.content}</p>
        <p id="author">{quote.author}</p>
      </div>
    </main>
  );
}