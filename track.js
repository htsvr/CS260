function updateUsername() {
    const nameEl = document.querySelector("#username");
    const username = localStorage.getItem("username");
    if (username) {
        nameEl.textContent = username;
    }
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
    let sessions = JSON.parse(localStorage.getItem("sessions"));
    const newSession = {user: localStorage.getItem("username"), timeStarted: Date.now(), timeElapsed: 0, ended: false};
    if (sessions == undefined){
        sessions = [];
    }
    sessions.push(newSession);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("isBoiling", true);
    updateButton();
}

function endSession(){
    let sessions = JSON.parse(localStorage.getItem("sessions"));
    sessions.forEach((session) => {
        if (session.user == localStorage.getItem("username") && !session.ended){
            session.timeElapsed = Date.now() - session.timeStarted;
            session.ended = true;
        }
    });
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("isBoiling", false);
    updateButton();
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
        document.querySelector("#totalWebsiteBoilingTime").textContent = getFormatedTime(personalTime);
        ref = Date.now();
        resolve = 1;
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
    sessions.forEach((session) => {
        data[(new Date(session.timeStarted)).getDay] += session.timeElapsed;
    });
    for(let i = 0; i < data.length; i++){
        data[i] = data[i] / (60*1000);
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
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
        data.push({x: session.timeStarted, y: session.timeElapsed});
    });
    new Chart(stx, {
        type: 'scatter',
        data: data,
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
    }, 1000 );

