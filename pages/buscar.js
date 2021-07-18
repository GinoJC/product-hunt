import React, {useState, useEffect} from 'react';
import Layout from "../components/layout/layout";
import { useRouter } from 'next/router';
import DetalleProducto from '../components/layout/DetalleProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {
  const router = useRouter();
  const {query: { q }} = router;

  const { products } = useProductos('creado');
  const [result, setResult] = useState([]);

  useEffect(() => {
    const busqueda = q.toString().toLowerCase();
    const filtro = products.filter(product =>
      product.nombre.toLowerCase().includes(busqueda) ||
      product.descripcion.toLowerCase().includes(busqueda)
    );
    setResult(filtro);
  }, [q, products]);

  return (
    <Layout>
      <div className='listado-productos'>
        <div className='contenedor'>
          <div className='bg-white'>
            {result.map(producto =>
              <DetalleProducto key={producto.id} producto={producto}/>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Buscar;