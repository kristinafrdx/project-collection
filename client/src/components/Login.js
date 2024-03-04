import axios from "axios";
import React, {useState} from "react";

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState(false);

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

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-container bg-white p-4 rounded shadow-lg" style={{ width: '500px', height: '500px' }}>
        <h2 className="text-center mb-4 fs-5 mt-5 upper">Log in</h2>
        <form className="p-4 pt-2" onSubmit={handleSubmit} >
          <div className="form-group mb-2">
            <label htmlFor="username" className="fw-bold mb-2">Enter login:</label>
            <input type="text" className="form-control w-100 pt-2" autoFocus id="username" placeholder="siginur@mail.ru" value={login} onChange={handleLogin} required />
            <label htmlFor="password" className="fw-bold mb-2 mt-2">Enter password:</label>
            <input type="password" className="form-control w-100 pt-2" id="password" placeholder="qwerty12345" value={password} onChange={handlePassword} required/>
          </div>
          {err && <p className="text-danger mb-0">Incorrect username or password.</p>}
        <div className="d-flex justify-content-between mt-4 flex-row gap-2">
          <button type="button" className="btn w-100" style={{backgroundColor: "#464da7", color: "#fff"}}>I'm guest</button>
          <button type="submit" className="btn w-100" style={{color: "#fff", backgroundColor: "#464da7"}}>Sign in</button>
        </div>
        <div className="d-flex align-items-center mt-3 flex-column">
           <h5 style={{color: "black", opacity: "60%", fontSize: "15px"}}>Don't have an account?</h5>
           <a href="!#" style={{textDecoration: "none", color: "#464da7"}} value="create">Create</a>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Login;