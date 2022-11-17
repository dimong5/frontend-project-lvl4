import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Error from './Error.jsx';
import Signup from './Signup.jsx';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Error />} />
    </Routes>
  </Router>
);

export default App;
