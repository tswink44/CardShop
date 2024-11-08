import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar';
import HomePage from './components/homepage';
import Login from './components/login';
import Register from "./components/register";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <Router>
            <NavBar setToken={setToken} />
            <div style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/login" component={Login} />
                    <Route path="/" exact render={() => <h1>Home</h1>}/>
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
