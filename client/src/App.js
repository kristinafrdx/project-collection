
import React from "react";
import Login from "./components/Login";
import Collections from "./components/Collections";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/collections" element={<Collections />} />
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
