import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { checkUserAsync } from '../authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [inputValue, setInputValue] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value
        });
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(checkUserAsync(inputValue));
        navigate('/');
    }

    return (
        <>
            <div className="bg-gray-50 p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Login</h3>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleInputChange} value={inputValue.email} name='email' type="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" required />
                    <input onChange={handleInputChange} value={inputValue.password} name='password' type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" required />
                    <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
                </form>
            </div>


            <p className="text-center text-gray-500 mt-4">
                Don't have an account?
                <span
                    className="text-blue-500 cursor-pointer hover:underline"
                >
                    Register here
                </span>
            </p>
        </>
    );
};


export default Login
