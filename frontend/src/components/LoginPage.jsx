import { Link, useNavigate } from 'react-router-dom';
import {
  React, useState, useRef, useEffect,
} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import axios from 'axios';
import {
  Form, Button, Row, Col, Card, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Login from '../images/Login.jpg';
import routes from '../routes/routes.js';
import useAuthorization from '../hooks/AuthorizationHook';

const LoginPage = () => {
  const [authorizationError, setAuthorizationError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const authorization = useAuthorization();
  const navigate = useNavigate();
  const loginElement = useRef();
  const passwordElement = useRef();
  const submitElement = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    loginElement.current.focus();
  }, []);

  const handleKeyDown = (event, inputRef) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  const LoginSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    validateOnChange: false,
    onSubmit: async () => {
      setAuthorizationError(false);
      setServerError(false);
      axios.post(routes.loginPagePath(), {
        username: formik.values.username,
        password: formik.values.password,
      })
        .then((response) => {
          authorization.logIn(response);
          navigate(routes.mainPage());
        })
        .catch((error) => {
          const { code } = error;
          switch (code) {
            case 'ERR_BAD_RESPONSE':
              return setServerError(true);
            default:
              return setAuthorizationError(true);
          }
        });
    },
  });

  const inputClassNames = cn('form-control', {
    'is-invalid': formik.errors.username || formik.errors.password || authorizationError || serverError,
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={Login} className="rounded-circle" alt={t('loginPage.header')} />
              </Col>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('loginPage.header')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required=""
                    placeholder={t('loginPage.placeholders.username')}
                    id="username"
                    ref={loginElement}
                    onKeyDown={(event) => handleKeyDown(event, passwordElement)}
                    className={inputClassNames}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  <Form.Label htmlFor="username">
                    {t('loginPage.placeholders.username')}
                  </Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-1">
                  <Form.Control
                    name="password"
                    autoComplete="current-password"
                    required=""
                    placeholder={t('loginPage.placeholders.password')}
                    type="password"
                    id="password"
                    ref={passwordElement}
                    onKeyDown={(event) => handleKeyDown(event, submitElement)}
                    className={inputClassNames}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <Form.Label className="form-label" htmlFor="password">
                    {t('loginPage.placeholders.password')}
                  </Form.Label>
                  <div
                    className={`invalid-tooltip ${
                      formik.errors || authorizationError || serverError ? '' : 'invisible'
                    }`}
                    id="signIn-error"
                  >
                    {serverError ? t('errors.server') : t('errors.loginValidation')}
                  </div>
                </Form.Group>
                <br />
                <Button
                  type="submit"
                  ref={submitElement}
                  onClick={() => loginElement.current.focus()}
                  className="w-100 mb-3"
                  disabled={formik.isSubmitting}
                  id="signIn-login-button"
                >
                  {t('loginPage.loginButton')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('loginPage.footerMessage')}</span>
                <Link to={routes.pageNotFoundPath()}>{t('loginPage.registrationLink')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
