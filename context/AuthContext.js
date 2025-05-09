import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, loginWithEmailAndPassword, registerWithEmailAndPassword, logoutUser, resetPassword, setupTokenRefresh, getCurrentToken, signInWithGoogle } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import apiClient from '../utils/apiClient';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor que envuelve la app y hace que la autenticación esté disponible para cualquier componente hijo
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(null);

  // Función de registro
  const signup = async (email, password, name, roles, location) => {
    try {
      setError('');
      const firebaseUser = await registerWithEmailAndPassword(email, password, name);
      
      // Obtener el token de Firebase
      const idToken = await getCurrentToken();
      setToken(idToken);
      
      // Después de la autenticación en Firebase, registrar al usuario en nuestro backend
      const userData = await apiClient.post('/api/users/register', {
        email,
        password,
        name,
        roles,
        location,
        firebase_uid: firebaseUser.uid
      });
      
      setUserDetails(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función de inicio de sesión
  const login = async (email, password) => {
    try {
      setError('');
      // Primero autenticar con Firebase
      const firebaseUser = await loginWithEmailAndPassword(email, password);
      
      // Obtener el token de Firebase
      const idToken = await getCurrentToken();
      setToken(idToken);
      
      // Luego iniciar sesión en nuestro backend
      const userData = await apiClient.post('/api/users/login', {
        email,
        password,
        firebase_uid: firebaseUser.uid
      });
      
      setUserDetails(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función de inicio de sesión con Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      const firebaseUser = await signInWithGoogle();
      
      // Obtener el token de Firebase
      const idToken = await getCurrentToken();
      setToken(idToken);
      
      // Registrar o iniciar sesión en nuestro backend
      const userData = await apiClient.post('/api/users/oauth/google', {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        firebase_uid: firebaseUser.uid
      });
      
      setUserDetails(userData);
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función de cierre de sesión
  const logout = async () => {
    try {
      setError('');
      await logoutUser();
      setUserDetails(null);
      setToken(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función de restablecimiento de contraseña
  const resetUserPassword = async (email) => {
    try {
      setError('');
      await resetPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función de actualización de usuario
  const updateUser = async (userId, userData) => {
    try {
      setError('');
      const updatedData = await apiClient.put(`/api/users/${userId}`, userData);
      
      // Actualizar los detalles del usuario en el estado con los nuevos datos
      setUserDetails(prevDetails => ({
        ...prevDetails,
        ...userData
      }));

      return updatedData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Efecto para manejar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Obtener el token
          const idToken = await user.getIdToken();
          setToken(idToken);
          
          // Si tenemos un usuario Firebase pero no detalles de usuario, obtenerlos de nuestro backend
          if (!userDetails) {
            try {
              const userData = await apiClient.get(`/api/users/byEmail/${user.email}`);
              setUserDetails(userData);
            } catch (error) {
              console.error("Error al obtener los detalles del usuario:", error);
            }
          }
        } catch (error) {
          console.error("Error durante el cambio de estado de autenticación:", error);
        }
      } else {
        setToken(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [userDetails]);

  // Configurar el listener de renovación de token de Firebase
  useEffect(() => {
    const unsubscribe = setupTokenRefresh((newToken) => {
      setToken(newToken);
    });
    
    return unsubscribe;
  }, []);

  // Objeto de valor con toda la funcionalidad de autenticación y estado
  const value = {
    currentUser,
    userDetails,
    token,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword: resetUserPassword,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 