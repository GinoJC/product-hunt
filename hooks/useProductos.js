import React, {useState, useEffect, useContext} from 'react';
import { FirebaseContext } from '../firebase';

const useProductos = (elemento, orden) => {
  const [products, setProducts] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase
        .db
        .collection('productos')
        .orderBy(elemento, orden)
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

  return {
    products
  }
}

export default useProductos;