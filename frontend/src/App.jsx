import './App.css'
import Footer from './Components/Footer'
import NavBar from './Components/NavBar'
import Home from './Pages/Home'
import Login from './Pages/Login.Jsx'
import Rooms from './Pages/Rooms'
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
      </Routes>
      </main>
      <Footer/>
    </> 
  )
}

export default App
