import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h1>
        <div className="flex flex-col gap-4">
          <input placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <input placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">Login</button>
          <p className="text-center text-gray-500 text-sm">Don't have an account? <Link to="/signup" className="text-purple-400 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}
