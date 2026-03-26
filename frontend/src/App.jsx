import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AskQuestion from './pages/AskQuestion'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import QuestionDetail from './pages/QuestionDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
