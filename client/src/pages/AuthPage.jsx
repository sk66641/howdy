import React, { useState } from 'react'
import Victory from '../assets/victory.svg'
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import { selectLoggedInUser, selectStatus } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {

  const user = useSelector(selectLoggedInUser);
  const status = useSelector(selectStatus);

  const [isLogin, setIsLogin] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const handleLoginClick = () => {
    setIsLogin(true);
    setIsRegister(false);
  };
  const handleRegisterClick = () => {
    setIsLogin(false);
    setIsRegister(true);
  }

  return (
    <>
      {user && <Navigate to={'/'} replace ></Navigate>}

      {status === 'loading' &&
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      }

      {status === 'idle' &&
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
              <img src={Victory} alt="Victory Logo" className="h-12 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Welcome to Victory</h2>
            <p className="text-gray-600 text-center mb-6">Please login or register to continue</p>

            <div className="flex justify-around mb-4">
              <button onClick={handleLoginClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
              <button onClick={handleRegisterClick} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Register</button>
            </div>

            {isLogin && (
              <Login />
            )}
            {isRegister && (
              <Register />
            )}

          </div>
        </div>}

    </>
  );
};


export default AuthPage
