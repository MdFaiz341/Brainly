

import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Dashboard } from './Pages/Dashboard'
import { Signup } from './Pages/Signup'
import { Signin } from './Pages/Signin'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Settings } from './Pages/Settings'
import { ChangePassword } from './Pages/ChangePassword'

function App() {
  

  return (
    <div className='w-screen bg-gray-900 min-h-screen flex flex-col font-inter'>
      <Routes>
        <Route path='/' element={<Signin/>}/>

        <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
          />
          
        <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard/settings/change-password" element={
            <ProtectedRoute>
              <ChangePassword/>
            </ProtectedRoute>
          }
        />
        
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
      </Routes>
    </div>
  )
}

export default App
