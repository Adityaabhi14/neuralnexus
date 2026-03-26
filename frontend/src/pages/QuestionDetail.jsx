import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getQuestion, postAnswer } from '../services/api'
import Loader from '../components/Loader'
import ErrorMsg from '../components/ErrorMsg'

export default function QuestionDetail() {
  const { id } = useParams()
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    getQuestion(id)
      .then(res => setQuestion(res.data))
      .catch(() => setError('Question not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAnswer = async () => {
    if (!answer.trim()) return
    try {
      await postAnswer(id, { body: answer })
      setAnswer('')
      const res = await getQuestion(id)
      setQuestion(res.data)
    } catch {
      alert('Failed to post answer.')
    }
  }

  if (loading) return <Loader />
  if (error) return <ErrorMsg message={error} />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{question.title}</h1>
        <p className="text-gray-400">{question.body}</p>
      </div>
      <h2 className="text-lg font-semibold text-white mb-4">{question.answers?.length || 0} Answers</h2>
      {question.answers?.map((ans, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-3">
          <p className="text-gray-300">{ans.body}</p>
        </div>
      ))}
      <div className="mt-6 flex flex-col gap-3">
        <textarea placeholder="Write your answer..." value={answer} rows={4}
          onChange={e => setAnswer(e.target.value)}
          className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
        <button onClick={handleAnswer}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
          Post Answer
        </button>
      </div>
    </div>
  )
}
