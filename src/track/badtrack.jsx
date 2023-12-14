import React from 'react';
import './track.css'

export function Track({username}) {
  const [currentBoilingTime, setCurrentBoilingTime] = React.useState(0);
  const [totalPersonalBoilingTime, setTotalPersonalBoilingTime] = React.useState(0);
  const [totalWebsiteBoilingTime, setTotalWebsiteBoilingTime] = React.useState(0);
  const [currentBoilers, setCurrentBoilers] = React.useState({});
  const [topBoilers, setTopBoilers] = React.useState({});
  const [sessions, setSessions] = React.useState(JSON.parse(localStorage.getItem("sessions")));
  const [isBoiling, setIsBoiling] = React.useState(checkIfBoiling());

  const currentBoilersList = Object.keys(currentBoilers).map((key) => {<li>{key} - {getFormatedTime(currentBoilers[key])}</li>});
  const topBoilersList = Object.keys(topBoilers).map((key) => {<li>{key} - {getFormatedTime(topBoilers[key])}</li>});
  
  async function GlobLoadSessions() {
    try {
      // Get the latest high scores from the service
      const response = await fetch('/api/sessions');
      setSessions(await response.json());
  
      // Save the scores in case we go offline in the future
      localStorage.setItem('sessions', JSON.stringify(sessions));
    } catch {
      // If there was an error then just use the last saved scores
      const sessionsText = localStorage.getItem('sessions');
      if (sessionsText) {
        setSessions(JSON.parse(sessionsText));
      }
    }
  }

  async function GlobSaveSession(session) {
    updateSessionsLocal(session);
    try {
      const response = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(session),
      });
    } catch {
      // If there was an error then just track scores locally
      // this.updateSessionsLocal(session);
    }
  }

  async function GlobEndSession() {
    endSessionsLocal();
    try {
      const response = await fetch('/api/sessions/end', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({"username": localStorage.getItem("username"), "time": Date.now()}),
      });
    } catch {
      // If there was an error then just track scores locally
      // endSessionsLocal();
    }
  }

  function updateSessionsLocal(newSession) {
    setSessions([...sessions, newSession]);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }

  function endSessionsLocal() {
    let tempSessions = sessions;
    tempSessions.forEach((session) => {
        if (session.user == localStorage.getItem("username") && !session.ended){
            session.timeElapsed = Date.now() - session.timeStarted;
            session.ended = true;
        }
    });
    setSessions(tempSessions);
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }

function boilingButtonPressed(){
    if(isBoiling) {
        endSession();
    }
    else{
        startSession();
    }
    update_sessions()
    //loadPlots();
}

function startSession(){
    const newSession = {user: username, timeStarted: Date.now(), timeElapsed: 0, ended: false};
    GlobSaveSession(newSession);
    setIsBoiling(true);
    broadcastEvent(username, "StartBoiling", Date.now());
}

function endSession(){
    GlobEndSession();
    setIsBoiling(false);
    broadcastEvent(username, "EndBoiling", Date.now());
}

function update_sessions(){
        let personalTime = 0;
        let totalTime = 0;
        for (let session of sessions) {
            if (!session.ended){
                session.timeElapsed = Date.now() - session.timeStarted;
                if(session.user === username && isBoiling){
                    setCurrentBoilingTime(Date.now() - session.timeStarted);
                }
            }
            if(session.user === username){
                personalTime += session.timeElapsed;
            }
            totalTime += session.timeElapsed;
        };
        setTotalPersonalBoilingTime(personalTime);
        setTotalWebsiteBoilingTime(totalTime);
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

// function loadPlots() {
//     //Chart.options.animation = false;
//     let chartStatus = Chart.getChart("barchart");
//     if (chartStatus != undefined) {
//         chartStatus.destroy();
//     }
//     const ctx = document.getElementById('barchart');
//     const sessions = JSON.parse(localStorage.getItem("sessions"));
//     let data = [0, 0, 0, 0, 0, 0, 0]
//     let day = 0;
//     sessions.forEach((session) => {
//         day = (new Date(session.timeStarted)).getDay();
//         data[day] += session.timeElapsed;
//     });
//     for(let i = 0; i < data.length; i++){
//         data[i] = data[i] / (60*1000);
//     }
//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//         labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
//         datasets: [{
//             label: 'Minutes Spent Boiling',
//             data: data,
//             borderWidth: 1
//         }]
//         },
//         options: {
//         scales: {
//             y: {
//             beginAtZero: true
//             }
//         },
//         animation: {
//             duration: 0
//         }
//         }
//     });
//     chartStatus = Chart.getChart("scatterplot");
//     if (chartStatus != undefined) {
//         chartStatus.destroy();
//     }
//     const stx = document.getElementById('scatterplot');
//     data = []
//     sessions.forEach((session) => {
//         data.push({x: (session.timeStarted-Date.now())/60000, y: session.timeElapsed/60000});
//     });
//     let dataset = {
//         datasets: [
//             {
//                 label: 'Minutes Boiled',
//                 data: data
//             }
//         ]
//     }
//     new Chart(stx, {
//         type: 'scatter',
//         data: dataset,
//         options: {
//         scales: {
//             x: {
//             type: 'linear',
//             position: 'bottom'
//             }
//         },
//         animation: {
//             duration: 0
//         }
//         }
//     });
// }

function addTime(user, time, obj) {
    if(obj[user]){
        obj[user] += time;
    } else {
        obj[user] = time;
    }
}

function updateBoilers() {
    let tempCurrentBoilers = {};
    let tempTopBoilers = {};
    let tempSessions = sessions;
    tempSessions.forEach((session) => {
        addTime(session.user, session.timeElapsed, tempTopBoilers);
        if (!session.ended) {
            addTime(session.user, Date.now() - session.timeStarted, tempTopBoilers);
            addTime(session.user, Date.now() - session.timeStarted, tempCurrentBoilers);
        }
    });
    setTopBoilers(tempTopBoilers);
    setCurrentBoilers(tempCurrentBoilers);
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

function checkIfBoiling(){
    for (let session of sessions) {
        if (session.user === username && session.ended == false) {
            return true;
        }
    }
    return false;
}

function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.onopen = (event) => {
        
    };
    socket.onclose = (event) => {
        
    };
    socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.type === "StartBoiling") {
        const newSession = {user: msg.from, timeStarted: msg.value, timeElapsed: 0, ended: false};
        updateSessionsLocal(newSession);
      } else if (msg.type === "EndBoiling") {
        let tempSessions = sessions;
        tempSessions.forEach((session) => {
            if (session.user == msg.from && !session.ended){
                session.timeElapsed = msg.value - session.timeStarted;
                session.ended = true;
            }
        });
        setSessions(tempSessions);
        localStorage.setItem("sessions", JSON.stringify(tempSessions));
      } else if (msg.type === "AddBoiling") {
        const newSession = {user: msg.from, timeStarted: msg.value.timeStarted, timeElapsed: msg.value.timeElapsed, ended: true};
        updateSessionsLocal(newSession);
      }
    };
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
(async () => {
    configureWebSocket();
    //await GlobLoadSessions();
    update_sessions();
    //loadPlots();
  })();

// setInterval(() => {
//     update_sessions();
//     updateBoilers();
//     //loadPlots();
//     }, 1000 );

  return (
    <main>
            <div className = 'main-col' id="button-col">
                <div className = 'grid-piece'>
                    <button id="startboiling" style = {isBoiling ? {background: 'gray'} : {background: 'white'}} onClick = {() => boilingButtonPressed()}>{isBoiling ? 'Stop Boiling' : 'Start Boiling'}</button>
                    <br/>
                    <br/>
                    <a href = "record.html">
                        <button>Record Previous Boil</button>
                    </a>
                </div>
                <div className = 'grid-piece'>
                    <div className="personalStats">
                        <h3>Current Boiling Time</h3>
                        <span id = "currentBoilingTime">{currentBoilingTime}</span>
                    </div>
                    <div className="personalStats">
                        <h3>Total Personal Boiling Time</h3>
                        <span id = "totalPersonalBoilingTime">{totalPersonalBoilingTime}</span>
                    </div>
                    <div className="personalStats">
                        <h3>Total Website Boiling Time</h3>
                        <span id = "totalWebsiteBoilingTime">{totalWebsiteBoilingTime}</span>
                    </div>
                </div>
            </div>
            <div className = 'main-col'>
                <div className='grid-piece'>
                    <h3>People Currently Boiling Water</h3>
                    <ul id = "currentBoilers">
                      {currentBoilersList}
                    </ul>
                </div>
                <div className = 'grid-piece'>
                    <h3>Top Water Boilers</h3>
                    <ul id = "topBoilers">
                      {topBoilersList}
                    </ul>
                </div>
            </div>
            <div className = 'main-col'>
                <div className = 'grid-piece'>
                    <canvas id="barchart"></canvas>
                </div>
                <div className = 'grid-piece'>
                    <canvas id="scatterplot"></canvas>
                </div>
            </div>
        </main>
  );
}