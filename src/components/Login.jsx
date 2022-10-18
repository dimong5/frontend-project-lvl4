import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/index.js";
import NavBar from "./Nav"

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const LoginPage = () => {
  const input = useRef();
  const auth = useAuth();

  useEffect(() => {
    input.current.focus();
  }, []);

  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema:  loginSchema ,
    onSubmit: async (values) => {
      try {
        //localStorage.clear();
        const response = await axios.post(
          "http://localhost:3000/api/v1/login",
          values
        );
        //debugger
        const token = JSON.stringify(response.data);
        console.log("token", token);
        localStorage.setItem('user', token);
        const local = localStorage.getItem('user');
        console.log('local', local);
        auth.logIn({ username: values.username });
        console.log('localStorage Login', localStorage.getItem('user'));
        //debugger
        //auth.logIn({ user: values.username, token: token });
        //console.log('auth.user', auth.user);
        navigate("../", { replace: true });
      } catch (err) {
        setErrorMessage(true);
      }
    },
  });
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavBar />
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center"></div>
                    <Form
                      onSubmit={formik.handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">Войти</h1>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          onChange={formik.handleChange}
                          value={formik.values.username}
                          placeholder="username"
                          name="username"
                          autoComplete="username"
                          required
                          id="username"
                          className="form-control"
                          ref={input}
                        />
                        <Form.Label className="form-label" htmlFor="username">
                          Username
                        </Form.Label>
                      </Form.Group>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          isInvalid={errorMessage}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          placeholder="password"
                          name="password"
                          autoComplete="current-password"
                          required
                          id="password"
                          className="form-control"
                          type="password"
                        />
                        <Form.Label className="form-label" htmlFor="password">
                          Password
                        </Form.Label>
                        <Form.Control.Feedback className="invalid-tooltip">
                          Неверные имя пользователя или пароль
                        </Form.Control.Feedback>
                      </Form.Group>
                      <button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                      >
                        Submit
                      </button>
                    </Form>
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
};

export default LoginPage;