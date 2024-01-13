import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const Successful = () => {
  return (
    <div>
      <div className='flex flex-col justify-center align-middle items-center border-2 border-green-500 w-fit p-3 gap-2 m-auto mt-32'>

        <h1 className='text-2xl font-bold'>Your Order has been placed sucessfully</h1>
        <h1><FontAwesomeIcon icon={faCheckCircle} className='text-green-500 text-2xl'/></h1>
        <Link to={'/myOrders'}><button className='bg-green-500 text-white font-bold text-2xl p-2 rounded-2xl'>My Orders</button></Link>
      </div>
    </div>
  )
}

export default Successful