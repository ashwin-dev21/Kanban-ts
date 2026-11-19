import Board from './components/Board'

export default function App() {
  return (
    <div>
      <nav
        style={{
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          height: 60,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                color: '#fff'
              }}
            >
              K
            </div>
            <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>
              Kanban Board
            </span>
          </div>

          <span style={{ fontSize: 13, color: '#94a3b8' }}>
            Task & Workflow Tracker
          </span>
        </div>
      </nav>

      <Board />
    </div>
  )
}