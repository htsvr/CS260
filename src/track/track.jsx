import React from 'react';
import './track.css'
import { GameNotifier } from './gameNotifier';

export function Track({ username }) {
    const [sessions, setSessions] = React.useState(JSON.parse(localStorage.getItem('sessions')) || []);
    const [time, setTime] = React.useState(Date.now());
    const [isBoiling, setIsBoiling] = React.useState(false);
    let [topBoilers, currentBoilers] = updateBoilers();

    React.useEffect(() => {
        GameNotifier.addHandler(handleGameEvent);
        async function setUp() {
            await GlobLoadSessions();
        }
        setUp();
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
            GameNotifier.removeHandler(handleGameEvent);
        };
    }, []);

    function handleGameEvent(msg) {
        if (msg.type === "StartBoiling") {
            const newSession = { user: msg.from, timeStarted: msg.value, timeElapsed: 0, ended: false };
            setSessions((prevSessions) => [...prevSessions, newSession]);
            localStorage.setItem('sessions', JSON.stringify(sessions));
        } else if (msg.type === "EndBoiling") {
            setSessions((prevSessions) => prevSessions.map((session) => {
                if (session.user == msg.from && !session.ended) {
                    session.timeElapsed = msg.value - session.timeStarted;
                    session.ended = true;
                }
                return session;
            }));
            localStorage.setItem("sessions", JSON.stringify(sessions));
        } else if (msg.type === "AddBoiling") {
            const newSession = { user: msg.from, timeStarted: msg.value.timeStarted, timeElapsed: msg.value.timeElapsed, ended: true };
            setSessions((prevSessions) => [...prevSessions, newSession]);
            localStorage.setItem('sessions', JSON.stringify(sessions));
        }
    }

    const currentBoilersList = Object.keys(currentBoilers).map((key) => { return (<li key={key}>{key} - {getFormatedTime(currentBoilers[key])}</li>); });
    const topBoilersList = Object.keys(topBoilers).map((key) => { return (<li key={key}>{key} - {getFormatedTime(topBoilers[key])}</li>); });

    async function GlobLoadSessions() {
        let sessions = [];
        try {
            // Get the latest high scores from the service
            const response = await fetch('/api/sessions');
            const tempSessions = await response.json();
            setSessions(await tempSessions);
            setIsBoiling(checkIfBoiling(await tempSessions));

            // Save the scores in case we go offline in the future
            localStorage.setItem('sessions', JSON.stringify(sessions));
        } catch {
            // If there was an error then just use the last saved scores
            const sessionsText = localStorage.getItem('sessions');
            if (sessionsText) {
                const tempSessions = JSON.parse(sessionsText);
                setSessions(tempSessions);
                setIsBoiling(checkIfBoiling(tempSessions));
            }
        }
    }

    function getTotalTime() {
        let time = 0;
        for (let key in topBoilers) {
            time += topBoilers[key];
        }
        return time;
    }

    function getPerTime() {
        let perTime = 0;
        for (let key in topBoilers) {
            if (key === username) {
                perTime += topBoilers[key];
            }
        }
        return perTime;
    }

    function getCurTime() {
        let curTime = 0;
        for (let session of sessions) {
            if (session.user === username) {
                if (!session.ended) {
                    curTime += time - session.timeStarted;
                }
            }
        }
        return curTime;
    }


    function checkIfBoiling(tempSessions) {
        for (let session of tempSessions) {
            if (session.user === username && session.ended == false) {
                return true;
            }
        }
        return false;
    }

    function getFormatedTime(ms) {
        const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, ms)),
            // Pull out parts of interest
            parts = [
                d.getUTCHours(),
                d.getUTCMinutes(),
                d.getUTCSeconds()
            ],
            // Zero-pad
            formatted = parts.map(s => String(s).padStart(2, '0')).join(':');

        return formatted;
    }

    async function GlobSaveSession(session) {
        setSessions((prevSessions) => [...prevSessions, session]);
        localStorage.setItem('sessions', JSON.stringify(sessions));
        const response = await fetch('/api/sessions/start', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(session),
        });
    }

    function endSessionsLocal() {
        let tempSessions = sessions;
        tempSessions.forEach((session) => {
            if (session.user == username && !session.ended) {
                session.timeElapsed = time - session.timeStarted;
                session.ended = true;
            }
        });
        setSessions(tempSessions);
        localStorage.setItem("sessions", JSON.stringify(sessions));
    }

    async function GlobEndSession() {
        endSessionsLocal();
        const response = await fetch('/api/sessions/end', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ "username": username, "time": Date.now() }),
        });
    }

    function startSession() {
        const newSession = { user: username, timeStarted: Date.now(), timeElapsed: 0, ended: false };
        GlobSaveSession(newSession);
        setIsBoiling(true);
        GameNotifier.broadcastEvent(username, "StartBoiling", Date.now());
    }

    function endSession() {
        GlobEndSession();
        setIsBoiling(false);
        GameNotifier.broadcastEvent(username, "EndBoiling", Date.now());
    }

    function boilingButtonPressed() {
        if (isBoiling) {
            endSession();
        } else {
            startSession();
        }
    }

    function addTime(user, time, obj) {
        if (obj[user]) {
            obj[user] += time;
        } else {
            obj[user] = time;
        }
    }

    function updateBoilers() {
        let tempCurrentBoilers = {};
        let tempTopBoilers = {};
        sessions.forEach((session) => {
            addTime(session.user, session.timeElapsed, tempTopBoilers);
            if (!session.ended) {
                addTime(session.user, time - session.timeStarted, tempTopBoilers);
                addTime(session.user, time - session.timeStarted, tempCurrentBoilers);
            }
        });
        return ([tempTopBoilers, tempCurrentBoilers]);
    }

    return (
        <main>
            <div className='main-col' id="button-col">
                <div className='grid-piece'>
                    <button id="startboiling" style={isBoiling ? { background: 'gray' } : { background: 'white' }} onClick={() => boilingButtonPressed()}>{isBoiling ? 'Stop Boiling' : 'Start Boiling'}</button>
                    <br />
                    <br />
                    <a href="record.html">
                        <button>Record Previous Boil</button>
                    </a>
                </div>
                <div className='grid-piece'>
                    <div className="personalStats">
                        <h3>Current Boiling Time</h3>
                        <span id="currentBoilingTime">{getFormatedTime(getCurTime())}</span>
                    </div>
                    <div className="personalStats">
                        <h3>Total Personal Boiling Time</h3>
                        <span id="totalPersonalBoilingTime">{getFormatedTime(getPerTime())}</span>
                    </div>
                    <div className="personalStats">
                        <h3>Total Website Boiling Time</h3>
                        <span id="totalWebsiteBoilingTime">{getFormatedTime(getTotalTime())}</span>
                    </div>
                </div>
            </div>
            <div className='main-col'>
                <div className='grid-piece'>
                    <h3>People Currently Boiling Water</h3>
                    <ul id="currentBoilers">
                        {currentBoilersList}
                    </ul>
                </div>
                <div className='grid-piece'>
                    <h3>Top Water Boilers</h3>
                    <ul id="topBoilers">
                        {topBoilersList}
                    </ul>
                </div>
            </div>
            <div className='main-col'>
                <div className='grid-piece'>
                    <canvas id="barchart"></canvas>
                </div>
                <div className='grid-piece'>
                    <canvas id="scatterplot"></canvas>
                </div>
            </div>
        </main>
    );
}