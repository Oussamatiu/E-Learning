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
import InstructorDashboard from './pages/InstructorDashboard'
import InstructorLayout from './pages/instructor/InstructorLayout'
import Dashboard from './pages/instructor/pages/Dashboard'
import MyCourses from './pages/instructor/pages/MyCourses'
import CreateCourse from './pages/instructor/pages/CreateCourse'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import Wallet from './pages/instructor/pages/Wallet'
import InstructorSetupProfile from './pages/instructor/InstructorSetupProfile'
import StudentLayout from './pages/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentCourses from './pages/student/StudentCourses'
import CourseLearning from './pages/student/CourseLearning'

function App() {
  return (
   <BrowserRouter>
  <Routes>
    {/* Public pages with header/footer */}
    <Route element={<Main />}>
      <Route path="/" element={<Home />} />
      <Route path="/become-instructor" element={<BecomeInstructor />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email/:token" element={<CheckEmail />} />
    </Route>

    {/* Student area with sidebar layout */}
    <Route path="/student" element={<StudentLayout />}>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="courses" element={<StudentCourses />} />
    </Route>

    {/* Course learning page (full-screen, no sidebar) */}
    <Route path="/student/course/:id" element={<CourseLearning />} />

    {/* Public instructor dashboard (overview) */}
    <Route path="/instructor" element={<InstructorDashboard />} />

    {/* Protected instructor area with sidebar layout */}
    <Route path="/instructor" element={<InstructorLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="create-course" element={<CreateCourse />} />
      <Route path="edit-course/:id" element={<CreateCourse />} />
      <Route path="wallet" element={<Wallet />} />
    </Route>

    {/* Instructor profile setup — full screen, no sidebar */}
    <Route path="/instructor/setup-profile" element={<InstructorSetupProfile />} />
  </Routes>
</BrowserRouter>
  )
}

export default App
