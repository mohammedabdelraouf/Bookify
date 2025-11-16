import React from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { useNavigation } from 'react-router-dom'

const RoomCard = ({roomImg, roomData}) => {
  return (
    <div   className='flex flex-col gap-24 md:flex-row  text-white bg-slate-400 rounded-lg shadow-md hover:bg-slate-800 transition-colors overflow-hidden'>
      <img src={roomImg} alt="" className='w-100  md:w-44' />
      <div className='flex flex-col justify-between p-5'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Room1</h2>
          <p className='mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Voluptate eius molestiae non quisquam assumenda optio.</p>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-lg'>$100 / night</span>
          
        </div>
      </div>
      <div className='flex items-center p-5'>

      <button className='bg-green-400 p-2  w-full rounded text-white font-bold hover:bg-green-500 transition-colors'>
            Book Now
      </button>
      </div>
    </div>
  );
}

export default RoomCard
