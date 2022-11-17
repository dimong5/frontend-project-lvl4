import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../images/page_not_found.svg';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet Chat
              </a>
            </div>
          </nav>
          <div className="text-center">
            <img
              alt="Страница не найдена"
              className="img-fluid h-25"
              src={logo}
            />
            <h1 className="h4 text-muted">{t('errorPage.pageNotFound')}</h1>
            <p className="text-muted">
              {t('errorPage.homepageInvitation')}
              {' '}
              <a href="/">{t('errorPage.homepageLinkCaption')}</a>
            </p>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
};

export default Home;
