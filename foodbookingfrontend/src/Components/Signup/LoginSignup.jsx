import React, { useEffect, useState } from 'react'
import logo from "../../Assets/Screenshot 2023-12-21 184458.png"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
export const LoginSignup = () => {
  const navigate=useNavigate();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

 const {setUser}=useContext(UserContext);
  const loginUser = async (ev) => {
    ev.preventDefault();

    try {
      
     const response= await axios.post('http://localhost:8080/api/v1/auth/signin', {
             
        email,
        password,
            });
            
            alert('User login successfully!');
setUser(response.data.user)
      navigate('/profile');
      const token=response.data.token;
      Cookies.set('token', token, { expires: 7 });
      console.log(token);
    
    } catch (error) {
      // Handle error
      alert('Error Login user:', error);
    }
  };
  
  return (
    <div className=''>
   <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto w-24"
            src={logo}
            alt="Your Company"
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="http://localhost:8080/api/v1/auth/signin" onSubmit={loginUser} method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
              value={email}
              onChange={ev=>setEmail(ev.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to='/forgotPassword' className="font-semibold text-red-600 hover:text-red-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
onChange={ev=>setPassword(ev.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-xl font-bold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to='/userSignup' className="font-semibold text-xl leading-6 text-red-600 hover:text-red-500">
              Signup
            </Link>
          </p>
        </div>
      </div>
       </div>
  )
}
