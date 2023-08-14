import React from 'react'
import { Route, Routes} from 'react-router-dom'
import SignIn from './pages/SignIn'
import ListPage from './pages/ListPage'
import { AuthContextProvider } from './context/AuthContext'
import Protected from './components/Protected'

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/listpage" element={<Protected><ListPage /></Protected>} />
        </Routes>
      </AuthContextProvider>
    </div>
  )
}

export default App;