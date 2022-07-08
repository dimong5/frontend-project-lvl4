import React from "react";

function Home() {
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
              className="img-fluid"
              src="https://cdn2.hexlet.io/assets/error-pages/404-34f20d4d98c81c575950c89d4c49027513d0bb3f6adbb3ed85ca0923496f65df.png"
            />
            <h1 className="h4 text-muted">Страница не найдена</h1>
            <p className="text-muted">
              Но вы можете перейти <a href="/">на главную страницу</a>
            </p>
          </div>
        </div>
        <div className="Toastify"></div>
      </div>
    </div>
  );
}

export default Home;
