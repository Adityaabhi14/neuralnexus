export default function ErrorMsg({ message }) {
  return <div className="text-center py-20 text-red-400">⚠️ {message || 'Something went wrong.'}</div>
}
