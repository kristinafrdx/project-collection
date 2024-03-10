import React, { createContext, useContext, useState } from "react";
import Login from "./components/Login";
import Collections from "./components/Collections";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Registration from "./components/Registration";
import MyCollections from "./components/MyCollections";

const AuthContext = createContext(); 

function App() {
  const [isLogged, setLogged] = useState(false);
  return (
    <div className="App">
       <AuthContext.Provider value={{ isLogged, setLogged }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/myCollections" element={isLogged ? <MyCollections /> : <Login />} />
          </Routes>
        </Router>
        </AuthContext.Provider>
    </div>
  );
}
export const useAuth = () => useContext(AuthContext);

export default App;
