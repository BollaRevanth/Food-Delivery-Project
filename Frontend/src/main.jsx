
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{ BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "102875323456-exampleplaceholder.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
         <StoreContextProvider>
             <App />
         </StoreContextProvider>
      </GoogleOAuthProvider>
   </BrowserRouter>
)
