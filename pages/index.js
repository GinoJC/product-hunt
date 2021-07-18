import React from 'react';
import Layout from "../components/layout/layout";
import DetalleProducto from '../components/layout/DetalleProducto';
import useProductos from '../hooks/useProductos';

const Home = () => {
  const { products } = useProductos('creado', 'desc');

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