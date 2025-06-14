import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createUserAsync } from '../authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const [inputValue, setInputValue] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });


  const handleInputChange = (e) => {

    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value
    });

  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.password !== inputValue.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(createUserAsync(inputValue));
  }

  return (
    <>
      <div className="bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <input onChange={handleInputChange} value={inputValue.fullName} name='fullName' type="text" placeholder="Full Name" className="w-full p-2 mb-2 border rounded" required />
            <input onChange={handleInputChange} value={inputValue.username} name='username' type="text" placeholder="Username" className="w-full p-2 mb-2 border rounded" required />
          </div>
          <input onChange={handleInputChange} value={inputValue.email} name='email' type="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" required />
          <input onChange={handleInputChange} value={inputValue.password} name='password' type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" required />
          <input onChange={handleInputChange} value={inputValue.confirmPassword} name='confirmPassword' type="password" placeholder="Confirm Password" className="w-full p-2 mb-4 border rounded" required />
          <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Register</button>
        </form>
      </div>

      <p className="text-center text-gray-500 mt-4">
        Already have an account?
        <span

          className="text-blue-500 cursor-pointer hover:underline"
        >
          Login here
        </span>
      </p>
    </>
  );
};


export default Register
