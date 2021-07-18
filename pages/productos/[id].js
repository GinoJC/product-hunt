import React, {useState, useEffect, useContext} from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/Error404'; 
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
  @media (min-width:768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: .5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Productos = () => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});

  const router = useRouter();
  const { query: { id }} = router;
  const { firebase, user } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProducto = async () => {
      const productoQuery = await firebase.db.collection('productos').doc(id);
      const producto = await productoQuery.get();
      if (producto.exists) {
        setProduct(producto.data());
      } else {
        setError(true);
      }
    }

    if (id) {
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(product).length === 0) return 'Cargando...';

  const { comentarios, creado, descripcion, empresa, nombre, url, urlImage, votos, creador, votantes } = product;

  const votarProducto = () => {
    console.log('votantes', votantes);
    console.log('user.uid', user.uid);
    var nuevoTotal, nuevoVotantes;
    if (votantes.includes(user.uid)) {
      nuevoTotal = votos - 1;
      nuevoVotantes = votantes.filter(votante => votante !== user.uid);
    } else {
      nuevoTotal = votos + 1;
      nuevoVotantes = [...votantes, user.uid];
    }

    firebase
      .db
      .collection('productos')
      .doc(id)
      .update({votos: nuevoTotal, votantes: nuevoVotantes});

    setProduct({
      ...product,
      votos: nuevoTotal,
      votantes: nuevoVotantes
    });
  }

  const comentarioChange = e => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value
    })
  }

  const agregarComentario = e => {
    e.preventDefault();
    comentario.usuarioId = user.uid;
    comentario.usuarioNombre = user.displayName;

    const nuevosComentarios = [...comentarios, comentario];

    firebase
      .db
      .collection('productos')
      .doc(id)
      .update({comentarios: nuevosComentarios});

    setProduct({
      ...product,
      comentarios: nuevosComentarios
    })
  }
 
  const esCreador = id => {
    if (creador.id === id) {
      return true;
    }
  }

  return (
    <Layout>
      {error && <Error404/>}
      <div className='contenedor'>
        <h1 css={css`
          text-align: center;
          margin-top: 5rem;
        `}>{nombre}</h1>
        <ContenedorProducto>
          <div>
            <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es})}</p>
            <img src={urlImage} width={500}/>
            <p>{descripcion}</p>
            {user &&
              <>
                <h2>Agrega tu comentario</h2>
                <form onSubmit={agregarComentario}>
                  <Campo>
                    <input
                      type='text'
                      name='mensaje'
                      placeholder='Ingresa un comentario'
                      onChange={comentarioChange}
                    />
                  </Campo>
                  <InputSubmit
                      type='submit'
                      value='Agregar Comentario'
                    />
                </form>
              </>
            }
            <h2 css={css`
              margin: 2rem 0;
            `}>Comentarios</h2>
            {comentarios.length === 0 ? 'Aún no hay comentarios' :
              <ul>
                {comentarios.map((comentario, i) => 
                  <li
                    key={i}
                    css={css`
                      border: 1px solid #e1e1e1;
                      padding: 2rem;
                    `}
                  >
                    <p>{comentario.mensaje}</p>
                    <p>
                      Escrito por: {''}
                      <span 
                        css={css`
                          font-weight: bold;
                        `}
                      >
                        {comentario.usuarioNombre}
                      </span>
                    </p>
                    { esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                  </li>
                )}
              </ul>
            }
          </div>
          <aside>
            <Boton
              target='_blank'
              bgColor='true'
              href={url}
            >
              Visitar URL
            </Boton>
            <p>Publicado por: {creador.nombre} de {empresa}</p>
            <div css={css`
                margin-top: 5rem;
              `}>
              <p css={css`
                text-align: center;
              `}>{votos} Votos</p>
              {user && 
                <Boton
                  onClick={votarProducto}
                >{votantes.includes(user.uid) ? 'Quitar Voto' : 'Votar'}</Boton>
              }
            </div>
          </aside>
        </ContenedorProducto>
      </div>
    </Layout>
  )
}

export default Productos;