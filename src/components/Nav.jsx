import React from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ parentComponent }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    auth.logOut();
    if ((parentComponent !== "Signup")|| (parentComponent !== "Login")) {
      navigate("/login");
    }
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">
          Hexlet Chat
        </a>
        {auth.user ? (
          <button
            type="button"
            onClick={handleClick}
            className="btn btn-primary"
          >
            Выйти
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default NavBar;