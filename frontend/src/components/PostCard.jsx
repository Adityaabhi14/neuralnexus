import { Link } from 'react-router-dom'

export default function PostCard({ question }) {
  return (
    <Link to={`/question/${question._id}`}>
      <div className="bg-gray-900 border border-gray-800 hover:border-purple-600 rounded-xl p-5 transition cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
            {question.author?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-gray-400 text-sm">{question.author || 'Anonymous'}</span>
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">{question.title}</h2>
        <p className="text-gray-400 text-sm line-clamp-2">{question.body}</p>
        <div className="flex gap-4 mt-4 text-gray-500 text-xs">
          <span>💬 {question.answers?.length || 0} answers</span>
          <span>👍 {question.votes || 0} votes</span>
        </div>
      </div>
    </Link>
  )
}
