import React, { use } from 'react'
import App from '../App'
import { useNavigate } from 'react-router-dom'
export const AppContext = React.createContext();
const AppContextProvider = () => {

  const navigate = useNavigate();  ;
  return (
    <AppContext.Provider value={{navigate} }>
      <App /> 
    </AppContext.Provider>
      
    
  )
}

export default AppContextProvider
