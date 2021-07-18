import React, {useState, useEffect, useContext} from 'react';
import Layout from "../components/layout/layout";
import { FirebaseContext } from '../firebase';
import DetalleProducto from '../components/layout/DetalleProducto';

const Home = () => {
  const [products, setProducts] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase
        .db
        .collection('productos')
        .orderBy('creado', 'desc')
        .onSnapshot(handleSnapshot);
    }
    obtenerProductos();
  }, []);

  function handleSnapshot(snapshot) {
    const productos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    setProducts(productos);
  }

  return (
    <Layout>
      <div className='listado-productos'>
        <div className='contenedor'>
          <div className='bg-white'>
            {products.map(producto =>
              <DetalleProducto key={producto.id} producto={producto}/>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home;