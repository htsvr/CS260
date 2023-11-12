function updateUsername() {
    const nameEl = document.querySelector("#username");
    const username = sessionStorage.getItem("username");
    if (username == undefined) {
        username = localStorage.getItem("username");
        sessionStorage.setItem("username", username);
    } if(username){
        nameEl.textContent = username;
    }
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
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
    const newSession = {user: sessionStorage.getItem("username"), timeStarted: Date.now()-ms, timeElapsed: ms, ended: true};
    GlobSaveSession(newSession);
    window.location.href = "track.html";
}

updateUsername();