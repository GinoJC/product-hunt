import React, {useState} from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from "../components/layout/layout";
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidation from '../hooks/useValidation';
import validateLogin from '../validations/validateLogin';
import firebase from '../firebase';

const INITIAL_STATE = {
  email: '',
  password: ''
}

const Login = () => {
  const [error, setError] = useState(false);
  const {values, errors, handleChange, handleSubmit, handleBlur} = useValidation(INITIAL_STATE, validateLogin, login);
  const {email, password} = values;

  async function login() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.log('Error login', error);
      setError(error.message);
    } 
  }

  return (
    <Layout>
      <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >Iniciar Sesión</h1>
        <Formulario
          onSubmit={handleSubmit}
          noValidate
        >
          <Campo>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='Tu Email'
              name='email'
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errors.email && <Error>{errors.email}</Error>}
          <Campo>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              placeholder='Tu Password'
              name='password'
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errors.password && <Error>{errors.password}</Error>}
          {error && <Error>{error}</Error>}
          <InputSubmit
            type='submit'
            value='Iniciar Sesión'
          />
        </Formulario>
      </>
    </Layout>
  );
};

export default Login;