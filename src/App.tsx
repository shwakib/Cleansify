import { ThemeProvider } from '@emotion/react'
import AuthPage from './pages/AuthPage'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './styles/theme'
import AppContainer from './layout/Container'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Router>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
