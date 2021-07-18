import React, {useState} from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from "../components/layout/layout";
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidation from '../hooks/useValidation';
import validarCrearCuenta from '../validations/validarCrearCuenta';
import firebase from '../firebase';

const INITIAL_STATE = {
  nombre: '',
  email: '',
  password: ''
}

const CrearCuenta = () => {
  const [error, setError] = useState(false);
  const {values, errors, handleChange, handleSubmit, handleBlur} = useValidation(INITIAL_STATE, validarCrearCuenta, crearCuenta);
  const {nombre, email, password} = values;

  async function crearCuenta() {
    try {
      await firebase.register(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.log('Error crearCuenta', error);
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
        >Crear Cuenta</h1>
        <Formulario
          onSubmit={handleSubmit}
          noValidate
        >
          <Campo>
            <label htmlFor='nombre'>Nombre</label>
            <input
              type='text'
              id='nombre'
              placeholder='Tu Nombre'
              name='nombre'
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errors.nombre && <Error>{errors.nombre}</Error>}
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
            value='Crear Cuenta'
          />
        </Formulario>
      </>
    </Layout>
  );
};

export default CrearCuenta;