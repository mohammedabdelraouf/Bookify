import './App.css'
import Footer from './Components/Footer'
import NavBar from './Components/NavBar'
import Home from './Pages/Home'
import Login from './Pages/Login.Jsx'
import Register from './Pages/Register'
import RoomDetails from './Pages/RoomDetails'
import Rooms from './Pages/Rooms'
import Payment from './Pages/Payment'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <NavBar />
      <main className='container mx-auto mt-8'>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/rooms/:RoomId' element={<RoomDetails />} />
          <Route path='rooms/:RoomId/payment' element={<Payment />} />
      </Routes>
      </main>
      <Footer/>
    </> 
  )
}

export default App
