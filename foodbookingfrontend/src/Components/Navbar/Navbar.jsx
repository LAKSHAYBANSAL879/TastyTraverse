import React, { useContext } from 'react';
import logo from '../../Assets/Screenshot_2023-12-21_184458-removebg-preview.png';
import bg from "../../Assets/81f3ff974d82520780078ba1cfbd453a1583259680.avif"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBars,faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CartContext, useCart } from '../../CartContext';

export const Navbar = () => {
    const history=useNavigate();
  const { user,setUser } = useContext(UserContext);
  const {getTotalItems}=useCart();

  return (
    <div className='w-full h-28 flex flex-row justify-around align-middle text-center items-center overflow-hidden' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      <div>
        <Link to='/'>
          <img src={logo} alt='TastyTraverse.com' className='w-32 p-2' />
        </Link>
      </div>
      {user && user.role === 'admin' && (
        <div className='flex flex-row gap-8 mr-32 text-white text-3xl font-bold '>
          <Link  to='home' className='hover:text-red-500  border-b-red-500 p-1'>Home</Link>
          <Link to='/veg' className='hover:text-red-500  p-1'>Veg</Link>
          <Link to='/nonveg' className='hover:text-red-500  p-1'>Non-Veg</Link>
          <Link to='/newResturant' className='hover:text-red-500  p-1'>Add Resturant</Link>
          <Link to='/myOrders' className='hover:text-red-500  p-1'>My Orders</Link>

        </div>
      )}

      {user && user.role === 'user' && (
        <div className='flex flex-row gap-8 mr-32 text-white text-3xl font-bold '>
          <Link to='/' className='hover:text-red-500  border-b-red-500 p-1'>Home</Link>
          <Link to='/veg' className='hover:text-red-500  border-b-red-500 p-1'>Veg</Link>
          <Link to='/nonveg' className='hover:text-red-500  border-b-red-500 p-1'>Non-Veg</Link>
          <Link to='/myOrders' className='hover:text-red-500  p-1'>My Orders</Link>

        </div>
      )}
      <div className='flex flex-row align-middle justify-center gap-4'>
        <div className='flex'>
          {/* <button onClick={handleLogout} className="text-white bg-red-500 text-xl font-bold rounded-xl p-3 cursor-pointer">Logout</button>
           */}
           <Link to='/cart'><FontAwesomeIcon icon={faCartShopping} className='text-3xl text-white mt-2'/></Link>
           <div className='text-xl text-white bg-red-500 rounded-full font-bold h-fit w-fit px-1 '>{getTotalItems()}</div>
        </div>

        <div>
          <div className='cursor-pointer flex flex-row w-fit gap-3 border-4 border-gray-300 rounded-3xl p-2 text-3xl'>
            <Link to={user ? '/profile' : '/signin'} className='flex flex-row gap-2 text-white'>
              <FontAwesomeIcon icon={faBars} className='hidden text-lg mt-2' />
              <FontAwesomeIcon icon={faUser} className='text-white' />
              {!!user && (
                <div className='flex flex-row text-lg font-bold'>{user.name}</div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

