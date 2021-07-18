import React, {useState, useContext} from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from "../components/layout/layout";
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidation from '../hooks/useValidation';
import validarCrearProducto from '../validations/validarCrearProducto';
import {FirebaseContext} from '../firebase';
import Error404 from '../components/layout/Error404';

const INITIAL_STATE = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {
  const [nameImgae, setNameImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [error, setError] = useState(false);
  
  const {values, errors, handleChange, handleSubmit, handleBlur} = useValidation(INITIAL_STATE, validarCrearProducto, crearProducto);
  const {nombre, empresa, imagen, url, descripcion} = values;
  const router = useRouter();
  const {user, firebase} = useContext(FirebaseContext);

  async function crearProducto() {
    try {
      if (!user) {
        return router.push('/login');
      }

      const producto = {
        nombre,
        empresa,
        url,
        urlImage,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(),
        creador: {
          id: user.uid,
          nombre: user.displayName
        },
        votantes: []
      }

      firebase
        .db
        .collection('productos')
        .add(producto);

      return router.push('/');
    } catch (error) {
      console.log('Error crearCuenta', error);
      setError(error.message);
    } 
  }

  const handleUploadStart = () => {
    setProgress(0);
    setLoading(true);
  }
 
    const handleProgress = uploadProgress => setProgress({ uploadProgress });
 
    const handleUploadError = error => {
      setLoading(error);
      console.error(error);
    };
 
  const handleUploadSuccess = async filename => {
    setProgress(100);
    setLoading(false);

    firebase
      .storage
      .ref('productos')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        setUrlImage(url);
      });
  };
  
  return (
    <Layout>
      {!user ?  <Error404/> :
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset>
              <legend>Información General</legend>
              <Campo>
                <label htmlFor='nombre'>Nombre</label>
                <input
                  type='text'
                  id='nombre'
                  placeholder='Nombre del Producto'
                  name='nombre'
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errors.nombre && <Error>{errors.nombre}</Error>}
              <Campo>
                <label htmlFor='empresa'>Empresa</label>
                <input
                  type='text'
                  id='empresa'
                  placeholder='Nombre Empresa o Compañia'
                  name='empresa'
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errors.empresa && <Error>{errors.empresa}</Error>}
              <Campo>
                <label htmlFor='imagen'>Imagen</label>
                <FileUploader
                  accept='image/*'
                  id='imagen'
                  name='imagen'
                  randomizeFilename
                  storageRef={firebase.storage.ref('productos')}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </Campo>
              <Campo>
                <label htmlFor='url'>url</label>
                <input
                  type='url'
                  id='url'
                  placeholder='URL de tu producto'
                  name='url'
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errors.url && <Error>{errors.url}</Error>}
            </fieldset>
            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor='descripcion'>descripcion</label>
                <textarea
                  id='descripcion'
                  name='descripcion'
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errors.descripcion && <Error>{errors.descripcion}</Error>}
            </fieldset>
            {error && <Error>{error}</Error>}
            <InputSubmit
              type='submit'
              value='Crear Producto'
            />
          </Formulario>
        </>
      }
    </Layout>
  );
};

export default NuevoProducto;