import Board from './components/Board'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        {/* App Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Kanban Board
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                Workspace
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Manage your tasks, track progress, and organize your workflow seamlessly.
            </p>
          </div>
        </header>

        {/* Main Board Container */}
        <main className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-white/80 p-6 sm:p-8">
          <Board />
        </main>
      </div>
    </div>
  )
}