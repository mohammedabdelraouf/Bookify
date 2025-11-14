import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import RoomCard from '../Components/RoomCard';
import assets from '../assets/assets';

const  Rooms = () => {
  const RoomsData = useContext(AppContext);
  const [filter, setFilter] = useState({
    price: [0, 1000],
    type: 'all',
    capacity: 1
  });
 
 const[filteredRooms, setFilteredRooms] = useState([]);

  // useEffect(() => {
  //   let rooms = RoomsData;
  //     // Apply price filter
  //     rooms = rooms.filter(room => room.price >= filter.price[0] && room.price <= filter.price[1]);
  //   // Apply type filter
  //     rooms = rooms.filter(room => room.type === filter.type);
  //   // Apply capacity filter
  //     rooms = rooms.filter(room => room.capacity >= filter.capacity);
  //     setFilteredRooms(rooms);}, [filter, RoomsData]);


  const{rooms} = {
    rooms: [1,2,3,4]
  }
  const images = [assets.room1, assets.room2, assets.room3, assets.room4, assets.room5];

  const [sortBy, setSortBy] = useState('price-asc');

  return (
    <main className='flex flex-col md:flex-row gap-8'>
      <aside className='w-full  md:w-1/4 p-4 border-r border-gray-600'>
        <div className='space-y-4'>
          <div>
            <h3 className='font-bold mb-2'>Price Range</h3>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={filter.price[1]} 
              onChange={(e) => setFilter({...filter, price: [0, e.target.value]})}
            />
            <div>${filter.price[0]} - ${filter.price[1]}</div>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Room Type</h3>
            <select 
              value={filter.type} 
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className='w-full p-2 border rounded'
            >
              <option value="all">All</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Sort By</h3>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full p-2 border rounded '
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </aside>

      <section id='rooms-container' className="flex-1 ">
        <div className="flex flex-col gap-5 p-10 ">
          // Map through filteredRooms instead of rooms// 
          {rooms.map((item, index) => (
            <Link key={index} to="/rooms/:index">
                <RoomCard  roomImg={images[index]} roomID={rooms[index]}/>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Rooms
