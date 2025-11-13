import React from 'react'
import assets from '../assets/assets.js'
import ReactImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css";

const Home = () => {
  return (
    <div className='my-10'>
     <ReactImageGallery 
        items={[
          {original: assets.room1, },
          {original: assets.room2,},
          {original: assets.room3, },
          {original: assets.room4, }]}
     /> 
    </div>
  )
}

export default Home
