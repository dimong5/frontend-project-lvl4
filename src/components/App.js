import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage.jsx';
import Login from './Login.jsx';
import NotFoundPage from './NotFoundPage';
import Registration from './Registration';
import PrivateOutlet from './PrivatOutlet';
import routes from '../routes/routes';

const App = () => (
  <Router>
    <Routes>
      <Route path={routes.chatPagePath()} element={<PrivateOutlet />}>
        <Route index element={<ChatPage />} />
      </Route>
      <Route path={routes.loginPagePath()} element={<Login />} />
      <Route path={routes.registrationPagePath()} element={<Registration />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
