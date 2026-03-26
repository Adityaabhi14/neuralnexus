import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [search, setSearch] = useState('')
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-purple-400">NeuralNexus</Link>
      <input type="text" placeholder="Search questions..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="hidden md:block bg-gray-800 text-sm text-white placeholder-gray-500 rounded-full px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      <div className="flex items-center gap-3">
        <Link to="/ask" className="bg-purple-600 hover:bg-purple-700 text-sm px-4 py-2 rounded-full font-medium transition">+ Ask</Link>
        <Link to="/profile" className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">U</Link>
      </div>
    </nav>
  )
}
