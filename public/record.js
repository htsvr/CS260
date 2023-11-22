function updateUsername() {
  const nameEl = document.querySelector("#username");
  const username = localStorage.getItem("username");
  if(username){
      nameEl.textContent = username;
  }
}

function logout() {
  localStorage.removeItem('username');
  fetch(`/api/auth/logout`, {
    method: 'delete',
  }).then(() => (window.location.href = '/'));
}

async function GlobSaveSession(session) {
    try {
      const response = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(session),
      });

      // Store what the service gave us as the high scores
      const sessions = await response.json();
      localStorage.setItem('sessions', JSON.stringify(sessions));
    } catch {
      // If there was an error then just track scores locally
      this.updateSessionsLocal(session);
    }
  }

function record() {
    const recHr = document.querySelector("#recHr").value;
    const recMin = document.querySelector("#recMin").value;
    const recSec = document.querySelector("#recSec").value;
    const ms = ((+recHr)*60*60+(+recMin)*60+(+recSec))*1000
    const newSession = {user: localStorage.getItem("username"), timeStarted: Date.now()-ms, timeElapsed: ms, ended: true};
    GlobSaveSession(newSession);
    broadcastEvent(localStorage.getItem("username"), "AddBoiling", {timeStarted: Date.now() - ms, timeElapsed: ms});
    window.location.href = "track.html";
}

function displayQuote(data) {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        document.querySelector('#quote').textContent = data.content;
        document.querySelector('#author').textContent = "- " + data.author;
      });
  }

  function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  }

  function broadcastEvent(from, type, value) {
    const event = {
      from: from,
      type: type,
      value: value,
    };
    socket.send(JSON.stringify(event));
}
let socket;

configureWebSocket();
updateUsername();
displayQuote();