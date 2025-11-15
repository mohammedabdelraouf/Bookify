import './App.css'
import Footer from './Components/Footer'
import NavBar from './Components/NavBar'
import ProtectedRoute from './Components/ProtectedRoute'
import Home from './Pages/Home'
import Login from './Pages/Login.Jsx'
import Register from './Pages/Register'
import RoomDetails from './Pages/RoomDetails'
import Rooms from './Pages/Rooms'
import Payment from './Pages/Payment'
import MyBookings from './Pages/MyBookings'
import AdminDashboard from './Pages/AdminDashboard'
import AdminBookings from './Pages/AdminBookings'
import AdminRooms from './Pages/AdminRooms'
import AdminPayments from './Pages/AdminPayments'
import AdminCustomers from './Pages/AdminCustomers'
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
          <Route path='/my-bookings' element={<MyBookings />} />

          {/* Admin Routes */}
          <Route path='/admin/dashboard' element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path='/admin/bookings' element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          } />
          <Route path='/admin/rooms' element={
            <ProtectedRoute>
              <AdminRooms />
            </ProtectedRoute>
          } />
          <Route path='/admin/payments' element={
            <ProtectedRoute>
              <AdminPayments />
            </ProtectedRoute>
          } />
          <Route path='/admin/customers' element={
            <ProtectedRoute>
              <AdminCustomers />
            </ProtectedRoute>
          } />
      </Routes>
      </main>
      <Footer/>
    </> 
  )
}

export default App
