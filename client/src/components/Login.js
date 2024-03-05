import axios from "axios";
import React, {useState} from "react";
import { Form } from 'react-bootstrap';
import theme from '../logo/theme.svg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUser = async (data) => {
    try {
      const resp = await axios.post('http://localhost:3030/login', data)
     if (resp.data.message) {
       setError(true);
     }
     console.log(resp.data)
     return resp;
    } catch (e) {
      console.error('Network error');
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = {
      login,
      password,
    }
    await fetchUser(data);
  }

  const handleLogin = (event) => {
    setLogin(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="d-flex flex-column">
      <header className={`header ${darkMode ? 'header-dark' : 'header-light'}`}>
        <h5 className="text-center createColl">Create your collections!</h5>
        <div className="themes">
          <img className={`${darkMode ? 'logo-themes-dark' : 'light-theme'}`} src={theme} alt="mode"/>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={darkMode}
              onChange={handleDarkMode}
            />
          </Form>
        </div>
        
      </header>
      <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'dark-theme' : 'light-theme'}`}> 
      <div className={`login-container p-4 shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'}`}>
        <h2 className="text-center mb-4 fs-5 mt-5 upper">Log in</h2>
        <form className="p-4 pt-2" onSubmit={handleSubmit} >
          <div className="form-group mb-2">
            <label htmlFor="username" className="fw-bold mb-2">Enter login:</label>
            <input type="text" className={`form-control w-100 pt-2 ${darkMode ? 'input-dark' : 'light-theme'}`} autoFocus id="username" placeholder="siginur@mail.ru" value={login} onChange={handleLogin} required />
            <label htmlFor="password" className="fw-bold mb-2 mt-2">Enter password:</label>
            <input type="password" className={`form-control w-100 pt-2 ${darkMode ? 'input-dark' : 'light-theme'}`} id="password" placeholder="qwerty12345" value={password} onChange={handlePassword} required/>
          </div>
          {err && <p className="text-danger mb-0">Incorrect username or password.</p>}
        <div className="d-flex justify-content-between mt-4 flex-row gap-2">
          <button type="button" className={`btn w-100 ${darkMode ? 'button-dark' : 'btn-light'}`} >I'm guest</button>
          <button type="submit" className={`btn w-100 ${darkMode ? 'button-dark' : 'btn-light'}`}>Sign in</button>
        </div>
        <div className="d-flex align-items-center mt-4 flex-column">
           <h5 className="account">Don't have an account?</h5>
           <a href="!#" className={`${darkMode ? 'create-dark' : 'create-light'}`}value="create">Create</a>
        </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;