import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  React, useState, useRef, useEffect,
} from 'react';
import { useFormik } from 'formik';
import cn from 'classnames';
import axios from 'axios';
import {
  Form, Button, Row, Col, Card, Container,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import Login from '../images/Login.jpg';
import routes from '../routes/routes.js';
import useAuthorization from '../hooks/AuthorizationHook.jsx';
import { loginSchema } from '../schemas/schemas.js';

const LoginPage = () => {
  const authorization = useAuthorization();
  const [authorizationFailed, setAuthorizationFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const rollbar = useRollbar();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setAuthorizationFailed(false);

      try {
        const result = await axios.post(routes.loginPath(), values);
        authorization.logIn(result.data);
        const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
        navigate(from);
      } catch (error) {
        rollbar.error(error);
        console.error(error);

        if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
          return;
        }

        if (error.response?.status === 401) {
          setAuthorizationFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('errors.network'));
        }
      }
    },
  });

  const inputClassNames = cn('form-control', { 'is-invalid': formik.errors.username || formik.errors.password || authorizationFailed });

  useEffect(() => { inputRef.current.focus(); }, []);

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={Login} className="rounded-circle" alt={t('login.header')} />
              </Col>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('login.header')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required=""
                    placeholder={t('login.username')}
                    id="username"
                    ref={inputRef}
                    className={inputClassNames}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  <Form.Label htmlFor="username">{t('login.username')}</Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-1">
                  <Form.Control
                    name="password"
                    autoComplete="current-password"
                    required=""
                    placeholder={t('login.password')}
                    type="password"
                    id="password"
                    className={inputClassNames}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <Form.Label className="form-label" htmlFor="password">{t('login.password')}</Form.Label>
                  {inputClassNames && <Form.Control.Feedback type="invalid" tooltip>{t('login.authFailed')}</Form.Control.Feedback>}
                </Form.Group>
                <br />
                <Button type="submit" variant="outline-primary" className="w-100 mb-3">{t('login.submit')}</Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('login.newToChat')}</span>
                <Link to={routes.signupPagePath()}>{t('login.signup')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
