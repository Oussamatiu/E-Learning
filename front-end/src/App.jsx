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
import InstructorLayout from './pages/instructor/InstructorLayout'
import Dashboard from './pages/instructor/pages/Dashboard'
import MyCourses from './pages/instructor/pages/MyCourses'
import CreateCourse from './pages/instructor/pages/CreateCourse'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccess from './pages/PaymentSuccess'
import ProfilePage from './pages/ProfilePage'
import Wallet from './pages/instructor/pages/Wallet'
import InstructorSetupProfile from './pages/instructor/InstructorSetupProfile'
import StudentLayout from './pages/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentCourses from './pages/student/StudentCourses'
import CourseLearning from './pages/student/CourseLearning'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/pages/Overview'
import AdminCourses from './pages/admin/pages/Courses'
import AdminUsers from './pages/admin/pages/Users'
import AdminPayments from './pages/admin/pages/Payments'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'

function App() {
  return (
   <BrowserRouter>
  <Routes>

    <Route element={<Main />}>
      <Route path="/" element={<Home />} />
      <Route path="/become-instructor" element={<BecomeInstructor />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={
        <ProtectedRoute allowedRoles={['student', 'instructor']}>
          <CartPage />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={['student', 'instructor']}>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/register" element={
        <GuestRoute><Register /></GuestRoute>
      } />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={
        <GuestRoute><Login /></GuestRoute>
      } />
      <Route path="/verify-email/:token" element={<CheckEmail />} />
    </Route>


    <Route path="/student" element={
      <ProtectedRoute allowedRoles={['student','instructor']}>
        <StudentLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="courses" element={<StudentCourses />} />
    </Route>


    <Route path="/student/course/:id" element={
      <ProtectedRoute allowedRoles={['student', 'admin', 'instructor']}>
        <CourseLearning />
      </ProtectedRoute>
    } />


    <Route path="/instructor" element={
      <ProtectedRoute allowedRoles={['instructor']}>
        <InstructorLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="create-course" element={<CreateCourse />} />
      <Route path="edit-course/:id" element={<CreateCourse />} />
      <Route path="wallet" element={<Wallet />} />
    </Route>


    <Route path="/profile" element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } />
    <Route path="/instructor/setup-profile" element={
      <ProtectedRoute allowedRoles={['instructor']}>
        <InstructorSetupProfile />
      </ProtectedRoute>
    } />

    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<AdminOverview />} />
      <Route path="courses" element={<AdminCourses />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="payments" element={<AdminPayments />} />
    </Route>
  </Routes>
</BrowserRouter>
  )
}

export default App
