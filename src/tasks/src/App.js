import logo from './logo.svg';
import './App.css';
import React from 'react'

import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import RegisterPage from './pages/RegisterPage'

function App(){
  return (
    <div className="App">
      <Router>
      <AuthProvider>
        <Header/>
        <PrivateRoute component={HomePage} path="/" exact/>
        <Route component={LoginPage} path="/login"/>
        <Route component={RegisterPage} path="/register"/>
      </AuthProvider>
      </Router>
    </div>
  )
}

export default App;
