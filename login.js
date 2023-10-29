function login() {
    const nameEl = document.querySelector("#usernameInput");
    localStorage.setItem("username", nameEl.value);
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