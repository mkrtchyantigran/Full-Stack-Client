import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

import Home from './pages/Home/Home';
import CreatePost from './pages/CreatePopst/CreatePost';
import Post from './pages/Post/Post';
import Registration from './pages/Registration/Registration';
import Login from './pages/Login/Login';
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/ChangePassword/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState((prevState) => ({ ...prevState, status: false }));
      } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className='navbar'>
            <div className='links'>
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registrations"> Registration</Link>
                </>
                ) : (
                  <>
                    <Link to="/"> Home Page</Link>
                    <Link to="/createpost">Create A Post</Link>
                  </>
                )}  
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
            </div>
          <Routes>
            <Route path="/"  element={<Home />} />
            <Route path="/createpost"  element={<CreatePost />} />
            <Route path="/post/:id"  element={<Post />} />
            <Route path="/registrations" element={ < Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={< PageNotFound />} />
            
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
