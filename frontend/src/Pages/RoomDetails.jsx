import React from 'react'
import assets from '../assets/assets'
import { useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../Context/AppContext.jsx';


const RoomDetails = () => {

    const {RoomId} = useParams();
    const {Rooms} = useContext(AppContext);
    const [RoomData, setRoomData] = useState(false);
    const [img, setImg] = useState('')

    const fetchProductData = async ()=>{
      Rooms.map((item)=>{
        if (item._id == productId) {
          setRoomData(item);
          setImg(item.image[0]);
        }
      })
    }
    useEffect(()=>{
      fetchProductData();
    },[RoomId])
  return (
    <>
    <section className='flex flex-col md:flex-row w-[80%] mx-auto my-10 ' >
      <div className='w-full md:w-1/4'>
        <img className='w-full shadow-xl' src={assets.room1} alt="" />
      </div>
        <div className='flex flex-col justify-between p-5 w-full md:w-3/4'>
        <div></div>
          <h2 className='text-2xl font-bold mb-2'>Room1</h2>
          <p className='mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Voluptate eius molestiae non quisquam assumenda optio.</p>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-bold text-lg'>$100 / night</span>
        </div>
      
      
    </section>
    {/* Reviews Section */}
    <section className='w-[80%] mx-auto my-10'>
      <h3 className='text-xl font-bold mb-4'>Reviews</h3>
      <div className='border-t pt-4'>
        <p className='mb-2'><span className='font-bold'>User1:</span> Great room, very comfortable!</p>
        <p className='mb-2'><span className='font-bold'>User2:</span> Excellent service and amenities.</p>
      </div>
    </section>
    {/*choose time for booking section*/}
    <section className='w-[80%] mx-auto my-10 bg-[rgba(10,10,10,0.2)] p-5 rounded-2xl'>
      <h3 className='text-xl font-bold mb-4'>Please choose date </h3>
      <div className='flex flex-col md:flex-row gap-4'>
         <input type="date" className='p-2 border rounded w-full md:w-1/4' />
         <input type="date" className='p-2 border rounded w-full md:w-1/4' />
      </div>
      <div className='flex flex-col w-full md:w-1/4 justify-center align-items-center my-5'>
       <button className='bg-green-400 p-2  w-8/12  rounded text-white font-bold hover:bg-green-500 transition-colors'>
            Book Now
        </button>
      </div>
    </section>
    </>
  )
}

export default RoomDetails
