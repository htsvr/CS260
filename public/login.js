function login() {
    const nameEl = document.querySelector("#usernameInput");
    let username = nameEl.value;
    if (username == ""){
        if (localStorage.getItem("username") != undefined){
            username = localStorage.getItem("username");
        }
        else {
            username = "user";
        }
    }
    localStorage.setItem("username", username);
    sessionStorage.setItem("username", username);
    window.location.href = "track.html";
}

function updateUsername() {
    const nameEl = document.querySelector("#username");
    const username = localStorage.getItem("username");
    if (username) {
        nameEl.textContent = username;
    }
}

updateUsername();