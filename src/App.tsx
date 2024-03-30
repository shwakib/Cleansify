import { ThemeProvider } from '@emotion/react'
import AuthPage from './pages/AuthPage'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './styles/theme'
import AppContainer from './layout/Container'
import Signup from './pages/Signup'
import Login from './pages/Login'
import UserProvider from './state/user/user.provider'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <AppContainer>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/Dashboard/:userId"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AppContainer>
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
