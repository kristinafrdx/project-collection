
import React from "react";
import Login from "./components/Login";
import Collections from "./components/Collections";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Registration from "./components/Registration";

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </Router>
    </div>
  );
}

//  {/* <AuthContext.Provider value={{ collections, setCollections }}> */}
//        {/* </AuthContext.Provider> */}
//  // const [collections, setCollections] = useState('');
// export const useAuth = () => useContext(AuthContext);
// const AuthContext = createContext();
export default App;
