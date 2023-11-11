function updateUsername() {
    const nameEl = document.querySelector("#username");
    const username = localStorage.getItem("username");
    if (username) {
        nameEl.textContent = username;
    }
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}

function record() {
    const bob = document.querySelector("#bob").value;
    const ms = ((((+bob.substring(0, 2))*60+(+bob.substring(3, 5)))*60+(+bob.substring(6, 8)))*1000+(+bob.substring(9, 12)));
    const newSession = {user: localStorage.getItem("username"), timeStarted: Date.now(), timeElapsed: ms, ended: true};
    const sessions = JSON.parse(localStorage.getItem("sessions"));
    if (sessions == undefined){
        sessions = [];
    }
    sessions.push(newSession);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    window.location.href = "track.html";
}

updateUsername();