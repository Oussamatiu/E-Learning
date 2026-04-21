import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import CourseDetails from './pages/CourseDetails'
import Categories from './pages/Categories'
import Courses from './pages/Courses'
import BecomeInstructor from './pages/BecomeInstructor'
import { Main } from './layouts/Main'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import CheckEmail from './pages/auth/CheckEmail'
import StudentDashboard from './pages/student/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import InstructorLayout from './pages/instructor/InstructorLayout'
import Dashboard from './pages/instructor/pages/Dashboard'
import MyCourses from './pages/instructor/pages/MyCourses'
import CreateCourse from './pages/instructor/pages/CreateCourse'

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
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email/:token" element={<CheckEmail />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
    </Route>

    {/* Public instructor dashboard (overview) */}
    <Route path="/instructor" element={<InstructorDashboard />} />

    {/* Protected instructor area with sidebar layout */}
    <Route path="/instructor" element={<InstructorLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="create-course" element={<CreateCourse />} />
      <Route path="edit-course/:id" element={<CreateCourse />} />
    </Route>
  </Routes>
</BrowserRouter>
  )
}

export default App
