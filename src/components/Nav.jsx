import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';

const NavBar = ({ parentComponent }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    auth.logOut();
    if ((parentComponent !== 'Signup') || (parentComponent !== 'Login')) {
      navigate('/login');
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
            {t('nav.logout')}
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default NavBar;
