import { useEffect, useState } from 'react'
import { getQuestions } from '../services/api'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'
import ErrorMsg from '../components/ErrorMsg'

export default function Home() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getQuestions()
      .then(res => setQuestions(res.data))
      .catch(() => setError('Failed to load questions.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <ErrorMsg message={error} />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white mb-2">Latest Questions</h1>
      {questions.length === 0 && <p className="text-gray-500">No questions yet. Be the first to ask!</p>}
      {questions.map(q => <PostCard key={q._id} question={q} />)}
    </div>
  )
}
