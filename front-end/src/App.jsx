import { useState } from 'react'

import './App.css'

import Home from './pages/Home'
import CourseDetails from './pages/CourseDetails'
import Categories from './pages/Categories'
import Courses from './pages/Courses'
import { Main } from './layouts/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'


function App() {
  

  return (
     <BrowserRouter>
     
      <Routes>
        
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
       
        <Route path="/" element={<Main><Home /></Main>}  />
        <Route path="/course/:id" element={<Main><CourseDetails /></Main>}  />
        <Route path="/categories" element={<Main><Categories /></Main>}  />
        <Route path="/courses" element={<Main><Courses /></Main>}  />
      </Routes>
    
     </BrowserRouter>
      
    
    
  )
}

export default App
