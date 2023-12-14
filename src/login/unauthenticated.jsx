import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'

export function Unauthenticated(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({email: userName, password: password}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
      navigate('/track')
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div id="loginControls" className='ver-flex'>
        <div className='hor-flex'>
          <label htmlFor='usernameInput'>Username</label>
          <input
            type='text'
            id="usernameInput"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='username'
          />
        </div>
        <div className='hor-flex'>
          <label htmlFor='userPassword'>Password</label>
          <input
            id='userPassword'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='password'
          />
        </div>
        <div className='hor-flex' style={{padding: '2em'}}>
          <button onClick={() => loginUser()}>
            Login
          </button>
          <button onClick={() => createUser()}>
            Create
          </button>
        </div>
      </div>
      <div id="errorMsg">{displayError}</div>
    </>
  );
}