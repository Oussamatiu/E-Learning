import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import CourseDetails from './pages/CourseDetails'
import Categories from './pages/Categories'
import Courses from './pages/Courses'
import BecomeInstructor from './pages/BecomeInstructor'
import { Main } from './layouts/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import InstructorDashboards from './pages/instructor/InstructorDashboard'
import Dashboard from './pages/instructor/pages/Dashboard'
import MyCourses from './pages/instructor/pages/MyCourses'
import CreateCourse from './pages/instructor/pages/CreateCourse'
import CourseStructure from './pages/instructor/pages/CourseStructure'
import LessonEditor from './pages/instructor/pages/LessonEditor'
import Analytics from './pages/instructor/pages/Analytics'
import Settings from './pages/instructor/pages/Settings'

function App() {
  return (
   <BrowserRouter>
  <Routes>
    <Route element={<Main />}>
      <Route path="/" element={<Home />} />
      <Route path="/become-instructor" element={<BecomeInstructor />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Route>
    <Route path="/instructor" element={<InstructorDashboards />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="create-course" element={<CreateCourse />} />
      <Route path="edit-course/:id" element={<CreateCourse />} />
      <Route path="course-structure" element={<CourseStructure />} />
      <Route path="lesson-editor/:id" element={<LessonEditor />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
</BrowserRouter>
  )
}

export default App
