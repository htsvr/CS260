import React from 'react';
import './app.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {  Login  } from './login/login';
import {  Track  } from './track/track';
import {  Record  } from './record/record';
import { AuthState } from './login/authState';

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  
  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        setAuthState(AuthState.Unauthenticated);
        setUserName(null);
        window.location.href = '/';
      });
  }

  return (
    <BrowserRouter>
        <div className="body">
            <header>
                <h1>Start Boiling</h1>
                <img className = 'svg' src = "/images/profile.svg" alt="profile image" />
                <h2 id = "username">{userName}</h2>
                <button onClick = {() => logout()}>Log out</button>
            </header>
            <Routes>
                <Route path='/' element={<Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />} exact />
                <Route path='/track' element={<Track username={userName}/>} />
                <Route path='/record' element={<Record username={userName}/>} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <footer>
                <a href="https://github.com/htsvr/StartBoiling">Github Page</a>
            </footer>
        </div>
    </BrowserRouter>
    );
}

function NotFound() {
    return <main>404: Return to sender. Address unknown.</main>;
  }