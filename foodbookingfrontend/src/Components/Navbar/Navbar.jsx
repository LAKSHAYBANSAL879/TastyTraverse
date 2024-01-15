import React, { useContext, useState } from 'react';
import logo from '../../Assets/Screenshot_2023-12-21_184458-removebg-preview.png';
import bg from "../../Assets/81f3ff974d82520780078ba1cfbd453a1583259680.avif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { CartContext, useCart } from '../../CartContext';

export const Navbar = () => {
  const history = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { getTotalItems } = useCart();
  const [showLinks, setShowLinks] = useState(false);

  const handleToggle = () => {
    setShowLinks(!showLinks);
  };

  return (
    <div className='w-full h-auto lg:h-28 flex flex-row lg:flex-row lg:flex justify-around items-center align-middle overflow-hidden' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      <div className='flex items-center justify-between  p-4'>
        <Link to='/' className=''>
          <img src={logo} alt='TastyTraverse.com' className='w-36 h-36 p-2' />
        </Link>
        <div className='lg:hidden'>
          <FontAwesomeIcon icon={faBars} className='text-3xl text-white ml-32 cursor-pointer' onClick={handleToggle} />
        </div>
      </div>

      <div className={`flex flex-col lg:flex lg:flex-row ${showLinks ? 'flex' : 'hidden'}`}>
        {user && (
          <div className='flex flex-col lg:flex-row gap-10   text-white text-2xl font-bold'>
            <Link to='/home' className='hover:text-red-500  border-b-red-500 p-1'>
              Home
            </Link>
            <Link to='/veg' className='hover:text-red-500  p-1'>
              Veg
            </Link>
            <Link to='/nonveg' className='hover:text-red-500  p-1'>
              Non-Veg
            </Link>
            {user.role === 'admin' && (
              <>
                <Link to='/newResturant' className='hover:text-red-500  p-1'>
                  Add Restaurant
                </Link>
                <Link to='/myOrders' className='hover:text-red-500  p-1'>
                  My Orders
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className='flex justify-end items-center gap-4 p-4'>
        <div className='flex'>
          <Link to='/cart'>
            <FontAwesomeIcon icon={faCartShopping} className='text-3xl text-white mt-2' />
          </Link>
          <div className='text-xl text-white bg-red-500 rounded-full font-bold h-fit w-fit px-1 '>
            {getTotalItems()}
          </div>
        </div>

        <div className={`lg:flex cursor-pointer lg:w-48 lg:gap-3 border-4 border-gray-300 rounded-3xl p-2 text-3xl ${showLinks ? 'hidden' : ''}`} onClick={handleToggle}>
          <Link to={user ? '/profile' : '/signin'} className='flex flex-row gap-2 text-white'>
         
            <FontAwesomeIcon icon={faUser} className='text-white' />
            {!!user && <div className='lg:flex flex-row text-lg font-bold'>{user.name}</div>}
          </Link>
        </div>
      </div>
    </div>
  );
};
