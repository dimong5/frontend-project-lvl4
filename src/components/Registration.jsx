import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Form, FormGroup, FormControl, Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../images/registration_logo.jpg';
import { useAuth } from '../hooks';
import NavBar from './Navbar';
import 'react-toastify/dist/ReactToastify.css';
import routes from '../routes/routes';

const Schema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .required('registrationPage.required')
    .min(3, 'registrationPage.nameLength')
    .max(20, 'registrationPage.nameLength'),
  password: Yup.string()
    .required('registrationPage.required')
    .trim()
    .min(6, 'registrationPage.passwordLengthError'),
  confirmPassword: Yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: Yup.string().oneOf(
      [Yup.ref('password')],
      'registrationPage.passwordComfirmationError',
    ),
  }),
});

const Registration = () => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Schema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const user = {
        username: values.username,
        password: values.password,
      };
      try {
        const response = await auth.signUp(user);
        auth.logOut();
        auth.logIn({ username: values.username, token: response.data.token });
        navigate(routes.chatPagePath(), { replace: true });
      } catch (e) {
        const { status } = e.response;
        if (status === 409) {
          formik.setErrors({
            username: 'registrationPage.userAlreadyExist',
          });
        } else {
          toast.error(t('alertMessage.connectionError'));
        }
      }
    },
  });

  return (
    <div className="h-100" id="chat">
      <div className="d-flex flex-column h-100">
        <NavBar />
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-content-center h-100">
            <div className="col-12 col-md-8 col-xxl-6">
              <div className="card shadow-sm">
                <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                  <div>
                    <img
                      src={logo}
                      className="rounded-circle"
                      alt="Регистрация"
                    />
                  </div>

                  <Form onSubmit={formik.handleSubmit} className="w-50">
                    <h1 className="text-center mb-4">
                      {t('registrationPage.regFormHeader')}
                    </h1>
                    <FormGroup className="form-floating mb-3">
                      <FormControl
                        ref={inputRef}
                        id="username"
                        name="username"
                        className="mb-3"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.errors.username && formik.touched.username
                        }
                      />
                      <Form.Label htmlFor="username">
                        {t('registrationPage.loginPlaceholder')}
                      </Form.Label>
                      <FormControl.Feedback type="invalid" tooltip>
                        {t(formik.errors.username)}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="form-floating mb-4">
                      <FormControl
                        id="password"
                        name="password"
                        className="mb-3"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.errors.password && formik.touched.password
                        }
                      />
                      <Form.Label htmlFor="password">
                        {t('registrationPage.passwordPlaceholder')}
                      </Form.Label>
                      <FormControl.Feedback type="invalid" tooltip>
                        {t(formik.errors.password)}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="form-floating mb-4">
                      <FormControl
                        id="confirmPassword"
                        name="confirmPassword"
                        className="mb-3"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.errors.confirmPassword
                          && formik.touched.confirmPassword
                        }
                      />
                      <Form.Label htmlFor="confirmPassword">
                        {t('registrationPage.passwordConfirmationPlaceholder')}
                      </Form.Label>
                      <FormControl.Feedback type="invalid" tooltip>
                        {t(formik.errors.confirmPassword)}
                      </FormControl.Feedback>
                    </FormGroup>
                    <Button
                      className="w-100"
                      variant="outline-primary"
                      type="submit"
                      disabled={formik.isSubmiting}
                    >
                      {t('registrationPage.submitButton')}
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Registration;
