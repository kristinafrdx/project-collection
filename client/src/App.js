import React, { createContext, useContext, useEffect, useState } from "react";
import Login from "./components/Login";
import Collections from "./components/Collections";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import MyCollections from "./components/MyCollections";
import CreateColl from './components/CreateColl'
import PageCollection from "./components/PageCollection";
import SuccessColl from "./components/SuccessColl";
import { IsLoggedProvider } from "./components/context/IsloggedContext";
import { useAuth } from "./components/context/IsloggedContext";
import { useNavigate } from "react-router-dom";
import AddItem from "./components/AddItem";
import Admin from "./components/Admin";

// const AuthContext = createContext(); 

function App() {
  const { isLogged, setLogged } = useAuth();
  
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/myCollections" element={isLogged ? <MyCollections /> : <Navigate to={"/"} />} />
            <Route path="/createColl" element={isLogged ? <CreateColl /> : <Navigate to='/'/>} />
            <Route path="/page" element={<PageCollection /> }/>
            <Route path="/success" element={isLogged ? <SuccessColl /> : <Navigate to='/'/>} />
            <Route path="/addItem" element={<AddItem />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
    </div>
  );
}
// export const useAuth = () => useContext(AuthContext);

export default App;
