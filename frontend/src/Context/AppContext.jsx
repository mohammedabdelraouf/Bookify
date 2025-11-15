import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Define the Context
export const AppContext = createContext();

// Define a custom hook for easy access to the context
export const useAppContext = () => useContext(AppContext);

// Export API_BASE_URL as a constant for use in other components
export const API_BASE_URL = 'http://localhost:5230/api';

const AppContextProvider = ({ children }) => { // Accept children prop
    const navigate = useNavigate();

    // 2. Use useState to store the actual data and loading/error states
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    // 3. Centralized Fetch Function
    const fetchData = async (endpoint, setDataState) => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // If the user isn't logged in (401 Unauthorized), we can log them out/redirect
                if (response.status === 401 && endpoint !== '/rooms') {
                    console.warn('Unauthorized access. Logging out...');
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status} for ${endpoint}`);
            }

            const data = await response.json();

            if (endpoint.toLowerCase().includes('room')) {
                // Clean up room data structure
                const cleanedRooms = data.map(room => ({
                    id: room.roomId,
                    number: room.roomNumber,
                    floor: room.floor,
                    status: room.status,
                    type: room.roomTypeName,
                    description: room.roomTypeDescription,
                    capacity: room.roomTypeCapacity,
                    price: room.roomTypePricePerNight,
                    images: room.images || []
                }));

                setDataState(cleanedRooms);
            } else {
                setDataState(data);
            }

            return data;

        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            setError(error.message);
            setDataState([]); // Clear data on error
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        setLoggedIn(false);
        navigate('/login');
    };

    // 4. useEffect to call fetch functions once on mount
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            // Fetch available rooms on app startup
            const roomPromise = fetchData('/rooms', setRooms);
            await roomPromise;

            setIsLoading(false);
        };

        fetchAllData();
    }, []); // Run once on mount

    // 5. Value to be provided to consumers (memoized to prevent unnecessary re-renders)
    const contextValue = useMemo(() => ({
        // State
        rooms,
        users,
        bookings,
        isLoading,
        error,
        loggedIn,

        // Functions
        setLoggedIn,
        logout,
        navigate,
        fetchData, // Expose fetchData if components need to refresh data manually
    }), [rooms, users, bookings, isLoading, error, loggedIn, logout]);

    // 6. Provide the context
    return (
        <AppContext.Provider value={contextValue}>
            {/* Render children passed to the provider, which includes App */}
            {children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;