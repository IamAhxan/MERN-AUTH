import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import routes from '../routes.jsx'
import './index.css'
import { AppContextProvider } from './context/AppContext.jsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
    <ToastContainer />
    <RouterProvider router={routes} />
    </AppContextProvider>
  </StrictMode>,
)
