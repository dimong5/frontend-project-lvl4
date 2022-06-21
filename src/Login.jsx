import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

function Login() {
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
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center"></div>

                    <Formik
                      initialValues={{ username: "", password: "" }}
                      validationSchema={LoginSchema}
                      onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                          alert(JSON.stringify(values, null, 2));
                          setSubmitting(false);
                        }, 400);
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                      }) => (
                        <form
                          className="col-12 col-md-6 mt-3 mt-mb-0"
                          onSubmit={handleSubmit}
                        >
                          <h1 className="text-center mb-4">Войти</h1>

                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              name="username"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.username}
                              autocomplete="username"
                              required=""
                              placeholder="Ваш ник"
                              id="username"
                              className="form-control"
                            />
                            <label for="username">Ваш ник</label>
                            {errors.username &&
                              touched.username &&
                              errors.username}
                          </div>

                          <div className="form-floating mb-4">
                            <input
                              type="password"
                              name="password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                              autocomplete="current-password"
                              required=""
                              placeholder="Пароль"
                              className="form-control"
                              id="password"
                            />
                            <label className="form-label" for="password">
                              Пароль
                            </label>
                            {errors.password &&
                              touched.password &&
                              errors.password}
                          </div>

                          <button type="submit" disabled={isSubmitting}>
                            Войти
                          </button>
                        </form>
                      )}
                    </Formik>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта?</span>
                      <a href="/signup">Регистрация</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify"></div>
      </div>
    </div>
  );
}

export default Login;
