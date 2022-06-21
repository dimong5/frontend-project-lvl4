import React from 'react';
import './App.css';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Error from './Error.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
   
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
   
    </div>
    </ Router>
  );
}

export default App;
