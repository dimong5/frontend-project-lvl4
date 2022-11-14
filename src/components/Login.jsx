import axios from "axios";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/index.js";
import NavBar from "./Nav";
import logo from "../images/login.jpeg";
import { useTranslation } from "react-i18next";

const loginSchema = Yup.object().shape({
  username: Yup.string()

    .min(2, "Too Short!")
    .max(50, "Too Long!"),
  password: Yup.string()
    .trim()
    .required("Required")
    .min(2, "Too Short!")
    .max(50, "Too Long!"),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const input = useRef();
  const auth = useAuth();

  useEffect(() => {
    input.current.focus();
  }, []);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "/api/v1/login",
          values
        );
        const token = response.data.token;
        auth.logIn({ username: values.username, token });
        navigate("../", { replace: true });
      } catch (err) {
        formik.setErrors({ username: "loginPage.loginOrPasswordError" });
      }
    },
  });
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavBar parentComponent="Login" />
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src={logo} className="rounded-circle" alt="Войти" />
                    </div>

                    <Form
                      onSubmit={formik.handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">
                        {t("loginPage.loginHeader")}
                      </h1>
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
                          {t("loginPage.usernamePlaceholder")}
                        </Form.Label>
                      </Form.Group>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          isInvalid={
                            formik.errors.username && formik.touched.username
                          }
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
                          {t("loginPage.passwordPlaceholder")}
                        </Form.Label>
                        <Form.Control.Feedback className="invalid-tooltip">
                          {t(formik.errors.username)}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                      >
                        {t("loginPage.submitButton")}
                      </button>
                    </Form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{t("loginPage.noAccount")}</span>
                      <a href="/signup">{t("loginPage.registration")}</a>
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
