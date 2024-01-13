import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const Abort = () => {
  return (
    <div>
    <div className='flex flex-col justify-center align-middle items-center border-2 border-red-500 w-fit p-3 gap-2 m-auto mt-32'>

      <h1 className='text-2xl font-bold'>Your has not been placed go to cart <br /> to procced payment use test Card <br /> number (4000003560000008)</h1>
      <h1><FontAwesomeIcon icon={faXmarkCircle} className='text-red-500 text-2xl'/></h1>
      <Link to={'/cart'}><button className='bg-red-500 text-white font-bold text-2xl p-2 rounded-2xl'>Cart</button></Link>
    </div>
  </div>
  )
}

export default Abort