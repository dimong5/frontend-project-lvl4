import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';
import routes from '../routes/routes';

const NavBar = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const handleClick = (e) => {
    e.preventDefault();
    auth.logOut();
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href={routes.chatPagePath()}>
          {t('nav.hexletChatHeader')}
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
