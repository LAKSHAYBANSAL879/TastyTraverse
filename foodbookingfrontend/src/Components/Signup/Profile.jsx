import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
// import { Account } from '../Account/Account';

export const Profile = () => {
  const { user, setUser } = useContext(UserContext);
 
  const history = useNavigate();

  const handleLogout = () => {
    setUser(null);
    Cookies.remove('token');
    history('/signin');
  };


  return (
   
    <div className="container mt-1 mx-auto p-4">
     
      <div className="max-w-md mt-5 text-lg mx-auto bg-white rounded-md overflow-hidden shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
          {user ? (
            <>
              <div className="mb-2">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="mb-2">
                <strong>Phone:</strong> {user.phone}
              </div>  
              <div className="mb-2">
                <strong>Role:</strong> {user.role}
              </div>   
              <div className="mb-2">
                <strong>Location</strong> {user.address}
              </div>            
               </>
          ) : (
            <p>Loading user data...</p>
          )}

         

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
