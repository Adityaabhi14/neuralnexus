import { useState } from 'react'
import { postQuestion } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function AskQuestion() {
  const [form, setForm] = useState({ title: '', body: '', author: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await postQuestion(form)
      navigate('/')
    } catch {
      alert('Failed to post question.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input placeholder="Your name" value={form.author}
          onChange={e => setForm({...form, author: e.target.value})}
          className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <input placeholder="Question title" value={form.title} required
          onChange={e => setForm({...form, title: e.target.value})}
          className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <textarea placeholder="Describe your question..." value={form.body} rows={6}
          onChange={e => setForm({...form, body: e.target.value})}
          className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
        <button type="submit" disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Question'}
        </button>
      </form>
    </div>
  )
}
