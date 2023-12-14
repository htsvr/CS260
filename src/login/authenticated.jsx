import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
        navigate('/')
      });
  }

  return (
    <div id="playControls">
      <div id='playerName'>{props.userName}</div>
      <button type='button' onClick={() => navigate('/track')}>
        Start Tracking
      </button>
      <button type='button' onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}
