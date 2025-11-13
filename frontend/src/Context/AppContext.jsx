import React from 'react'
import App from '../App'
export const AppContext = React.createContext();
const AppContextProvider = () => {
  return (
    <AppContext.Provider value={{} }>
      <App /> 
    </AppContext.Provider>
      
    
  )
}

export default AppContextProvider
