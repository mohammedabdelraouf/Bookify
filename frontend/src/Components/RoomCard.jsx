import React from 'react'

const RoomCard = (/*need to make it daynamic*/) => {
  return (
    <div className='flex flex-col md:flex-row gap-5 text-white bg-slate-400 rounded-sm shadow-md'>
      <img src="" alt="" />
      <div className='flex flex-col justify-between p-5'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Room1</h2>
          <p className='mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Voluptate eius molestiae non quisquam assumenda optio.</p>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-lg'>$100 / night</span>
          <button className='bg-green-400 p-2 rounded text-white font-bold hover:bg-green-500 transition-colors'>
            Book Now
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default RoomCard
