import React from 'react'
import { useState, useContext, useEffect } from 'react'
import RoomCard from '../Components/RoomCard';

const Rooms = () => {
  const{rooms} = {
    rooms: [1,2,3,4,5]
  }

  return (
    <div className=''>
      <div className="flex flex-col gap-5 p-10">
       {
        rooms.map((item,index)=>{
          return (<RoomCard key={index}/>)
        })
       }
      </div>
      
    </div>
  )
}

export default Rooms
