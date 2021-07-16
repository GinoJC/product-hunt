import firebase, { FirebaseContext } from '../firebase';
import useAuth from '../hooks/useAuth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const user = useAuth();

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        user
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  )
}

export default MyApp;