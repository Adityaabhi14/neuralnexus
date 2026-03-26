export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-3xl font-bold">U</div>
        <h1 className="text-2xl font-bold text-white">Username</h1>
        <p className="text-gray-400">user@email.com</p>
        <div className="flex gap-8 mt-4 text-center">
          <div><p className="text-white font-bold text-xl">12</p><p className="text-gray-500 text-sm">Questions</p></div>
          <div><p className="text-white font-bold text-xl">48</p><p className="text-gray-500 text-sm">Answers</p></div>
          <div><p className="text-white font-bold text-xl">320</p><p className="text-gray-500 text-sm">Votes</p></div>
        </div>
      </div>
    </div>
  )
}
