async function GlobLoadSessions() {
    let sessions = [];
    try {
      // Get the latest high scores from the service
      const response = await fetch('/api/sessions');
      sessions = await response.json();
  
      // Save the scores in case we go offline in the future
      localStorage.setItem('sessions', JSON.stringify(sessions));
    } catch {
      // If there was an error then just use the last saved scores
      const sessionsText = localStorage.getItem('sessions');
      if (sessionsText) {
        sessions = JSON.parse(sessionsText);
      }
    }
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

  async function GlobEndSession() {
    try {
      const response = await fetch('/api/sessions/end', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({"username": localStorage.getItem("username")}),
      });

      // Store what the service gave us as the high scores
      const sessions = await response.json();
      localStorage.setItem('sessions', JSON.stringify(sessions));
    } catch {
      // If there was an error then just track scores locally
      this.endSessionsLocal();
    }
  }

  function updateSessionsLocal(newScore) {
    let sessions = [];
    const sessionsText = localStorage.getItem('sessions');
    if (sessionsText) {
      sessions = JSON.parse(sessionsText);
    }
    sessions.push(newScore);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }

  function endSessionsLocal() {
    let sessions = [];
    const sessionsText = localStorage.getItem('sessions');
    if (sessionsText) {
      sessions = JSON.parse(sessionsText);
    }
    sessions.forEach((session) => {
        if (session.user == localStorage.getItem("username") && !session.ended){
            session.timeElapsed = Date.now() - session.timeStarted;
            session.ended = true;
        }
    });
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }

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

function boilingButtonPressed(){
    if(localStorage.getItem("isBoiling") == "true") {
        endSession();
    }
    else{
        startSession();
    }
}

function startSession(){
    const newSession = {user: localStorage.getItem("username"), timeStarted: Date.now(), timeElapsed: 0, ended: false};
    // if (sessions == undefined){
    //     sessions = [];
    // }
    // sessions.push(newSession);
    // localStorage.setItem("sessions", JSON.stringify(sessions));
    GlobSaveSession(newSession);
    localStorage.setItem("isBoiling", true);
    updateButton();
    const newItem = document.createElement("li");
    newItem.appendChild(document.createTextNode(localStorage.getItem("username")));
    document.querySelector("#currentBoilers").appendChild(newItem);
}

function endSession(){
    GlobEndSession();
    localStorage.setItem("isBoiling", false);
    updateButton();
    const currentBoilers = document.querySelector("#currentBoilers");
    for (const child of currentBoilers.children) {
        if (child.textContent == localStorage.getItem("username")){
            currentBoilers.removeChild(child);
        }
    }
}

function updateButton(){
    const boiling = localStorage.getItem("isBoiling")
    if(boiling == "true") {
        document.querySelector("#startboiling").textContent = "Stop Boiling";
        document.querySelector("#startboiling").style.background = "gray";
    }
    else {
        document.querySelector("#startboiling").textContent = "Start Boiling";
        document.querySelector("#startboiling").style.background = "white";
    }
    update_sessions()
    loadPlots();
}

function update_sessions(){
        let personalTime = 0;
        let totalTime = 0;
        document.querySelector("#currentBoilingTime").textContent = getFormatedTime(0);
        sessions = JSON.parse(localStorage.getItem("sessions"));
        sessions.forEach((session) => {
            if (!session.ended){
                session.timeElapsed = Date.now() - session.timeStarted;
                if(session.user == localStorage.getItem("username")){
                    localStorage.setItem("currentBoilingTime", -1*session.timeStarted)
                    document.querySelector("#currentBoilingTime").textContent = getFormatedTime(Date.now() - session.timeStarted);
                }
            }
            if(session.user == localStorage.getItem("username")){
                personalTime += session.timeElapsed;
            }
            totalTime += session.timeElapsed;
        });
        
        localStorage.setItem("totalPersonalBoilingTime", personalTime-Date.now())
        document.querySelector("#totalPersonalBoilingTime").textContent = getFormatedTime(personalTime);
        localStorage.setItem("totalWebsiteBoilingTime", totalTime-Date.now())
        document.querySelector("#totalWebsiteBoilingTime").textContent = getFormatedTime(totalTime);
}

function getFormatedTime(ms){
    const d = new Date(Date.UTC(0,0,0,0,0,0,ms)),
  // Pull out parts of interest
  parts = [
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  ],
  // Zero-pad
  formatted = parts.map(s => String(s).padStart(2,'0')).join(':');

    return formatted;
}

function loadPlots() {
    let chartStatus = Chart.getChart("barchart");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const ctx = document.getElementById('barchart');
    const sessions = JSON.parse(localStorage.getItem("sessions"));
    let data = [0, 0, 0, 0, 0, 0, 0]
    let day = 0;
    sessions.forEach((session) => {
        day = (new Date(session.timeStarted)).getDay();
        data[day] += session.timeElapsed;
    });
    for(let i = 0; i < data.length; i++){
        data[i] = data[i] / (60*1000);
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        datasets: [{
            label: 'Minutes Spent Boiling',
            data: data,
            borderWidth: 1
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    });
    chartStatus = Chart.getChart("scatterplot");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const stx = document.getElementById('scatterplot');
    data = []
    sessions.forEach((session) => {
        data.push({x: (session.timeStarted-Date.now())/60000, y: session.timeElapsed/60000});
    });
    let dataset = {
        datasets: [
            {
                label: 'Minutes Boiled',
                data: data
            }
        ]
    }
    new Chart(stx, {
        type: 'scatter',
        data: dataset,
        options: {
        scales: {
            x: {
            type: 'linear',
            position: 'bottom'
            }
        }
        }
    });
}

function addTime(user, time, obj) {
    if(obj[user]){
        obj[user] += time;
    } else {
        obj[user] = time;
    }
}

function updateBoilers() {
    let CurrentBoilers = {};
    let TopBoilers = {};
    const sessions = JSON.parse(localStorage.getItem("sessions"));
    sessions.forEach((session) => {
        addTime(session.user, session.timeElapsed, TopBoilers);
        if (!session.ended) {
            addTime(session.user, Date.now() - session.timeStarted, TopBoilers);
            addTime(session.user, Date.now() - session.timeStarted, CurrentBoilers);
        }
    });
    BoilerStats("#topBoilers", TopBoilers);
    BoilerStats("#currentBoilers", CurrentBoilers);
}

function BoilerStats(listId, obj) {
    let BoilersArray = [];
    for (const user in obj) {
        BoilersArray.push({user: user, time: obj[user]});
    }
    BoilersArray.sort((a,b) => (a.time > b.time) ? -1 : ((b.time > a.time) ? 1 : 0))
    const topEl = document.querySelector(listId);
    deleteChildren(topEl);
    
    let newItem = document.createElement("li");
    BoilersArray.forEach((obj) => {
        newItem = document.createElement("li");
        newItem.appendChild(document.createTextNode(obj.user + ' - ' + getFormatedTime(obj.time)));
        topEl.appendChild(newItem);
    })
}

function deleteChildren(elem) {
    var child = elem.lastElementChild;  
    while (child) { 
        elem.removeChild(child); 
        child = elem.lastElementChild; 
    } 
}

updateUsername();
updateButton();
update_sessions();
loadPlots();
setInterval(() => {
    if(localStorage.getItem("isBoiling") == "true"){
        document.querySelector("#currentBoilingTime").textContent = getFormatedTime(+localStorage.getItem("currentBoilingTime")+Date.now());
        document.querySelector("#totalPersonalBoilingTime").textContent = getFormatedTime(+localStorage.getItem("totalPersonalBoilingTime")+Date.now());
        document.querySelector("#totalWebsiteBoilingTime").textContent = getFormatedTime(+localStorage.getItem("totalWebsiteBoilingTime")+Date.now());
    }
    //GlobLoadSessions();
    updateBoilers();
    }, 1000 );
    setInterval(() => {
        GlobLoadSessions();
        }, 10000 );

