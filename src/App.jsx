import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/chat/ChatWidget'
import ScrollToTop from './components/ScrollToTop'
import BottomNav from './components/BottomNav'

const Home = lazy(() => import('./pages/Home'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const Messages = lazy(() => import('./pages/Messages'))

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-16 pb-16 md:pb-0" role="main">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/providers/:id" element={<ProviderProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}

export default App

