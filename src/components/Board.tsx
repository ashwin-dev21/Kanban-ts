import Column from './Column'
import useLocalStorage from '../hooks/useLocalStorage'
import type { Columns, Task } from '../types'

const initial: Columns = {
  todo: [],
  progress: [],
  done: []
}

// Configuration to give each column a distinct visual identity
const COLUMN_CONFIG: {
  key: keyof Columns
  label: string
  accentColor: string
  badgeBg: string
}[] = [
  {
    key: 'todo',
    label: 'To Do',
    accentColor: '#64748b', // Slate
    badgeBg: '#f1f5f9'
  },
  {
    key: 'progress',
    label: 'In Progress',
    accentColor: '#3b82f6', // Blue
    badgeBg: '#eff6ff'
  },
  {
    key: 'done',
    label: 'Done',
    accentColor: '#10b981', // Emerald
    badgeBg: '#ecfdf5'
  }
]

export default function Board() {
  const [tasks, setTasks] = useLocalStorage<Columns>('tasks', initial)

  const addTask = (col: keyof Columns, text: string) => {
    if (!text.trim()) return
    const newTask: Task = { id: Date.now(), text: text.trim() }
    setTasks({
      ...tasks,
      [col]: [...tasks[col], newTask]
    })
  }

  const deleteTask = (col: keyof Columns, id: number) => {
    setTasks({
      ...tasks,
      [col]: tasks[col].filter(t => t.id !== id)
    })
  }

  const moveTask = (from: keyof Columns, to: keyof Columns, task: Task) => {
    if (from === to) return
    setTasks({
      ...tasks,
      [from]: tasks[from].filter(t => t.id !== task.id),
      [to]: [...tasks[to], task]
    })
  }

  const totalTasks =
    tasks.todo.length + tasks.progress.length + tasks.done.length

  return (
    <div style={styles.wrapper}>
      {/* Clean Board Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Project Board</h1>
          <p style={styles.subtitle}>
            Track and manage your tasks across stages
          </p>
        </div>
        <div style={styles.totalBadge}>
          {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
        </div>
      </header>

      {/* Columns Grid */}
      <div style={styles.boardGrid}>
        {COLUMN_CONFIG.map(({ key, label, accentColor, badgeBg }) => {
          const columnTasks = tasks[key]

          return (
            <div
              key={key}
              style={{
                ...styles.columnCard,
                borderTop: `3px solid ${accentColor}`
              }}
            >
              {/* Status Indicator Pill */}
              <div style={styles.columnHeader}>
                <span
                  style={{
                    ...styles.statusDot,
                    backgroundColor: accentColor
                  }}
                />
                <span style={styles.columnLabel}>{label}</span>
                <span
                  style={{
                    ...styles.countBadge,
                    backgroundColor: badgeBg,
                    color: accentColor
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              <Column
                title="" // Handled cleanly by the custom header above
                type={key}
                tasks={columnTasks}
                addTask={addTask}
                deleteTask={deleteTask}
                moveTask={moveTask}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc', // Soft slate canvas background
    padding: '32px 24px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
    color: '#0f172a',
    boxSizing: 'border-box'
  },
  header: {
    maxWidth: 1200,
    margin: '0 auto 28px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#0f172a'
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: 14,
    color: '#64748b'
  },
  totalBadge: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '6px 14px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
  },
  boardGrid: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
    alignItems: 'start'
  },
  columnCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 16,
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: '1px solid #f1f5f9'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%'
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e293b',
    letterSpacing: '-0.01em'
  },
  countBadge: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 999
  }
}