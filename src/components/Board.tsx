import Column from './Column'
import useLocalStorage from '../hooks/useLocalStorage'
import type { Columns, Task } from '../types'

const initial: Columns = {
  todo: [],
  progress: [],
  done: []
}

const COLUMN_CONFIG: {
  key: keyof Columns
  label: string
  accentColor: string
  badgeBg: string
}[] = [
  {
    key: 'todo',
    label: 'To Do',
    accentColor: '#64748b',
    badgeBg: '#f1f5f9'
  },
  {
    key: 'progress',
    label: 'In Progress',
    accentColor: '#3b82f6',
    badgeBg: '#eff6ff'
  },
  {
    key: 'done',
    label: 'Done',
    accentColor: '#10b981',
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
  const completedTasks = tasks.done.length

  return (
    <div style={styles.wrapper}>
      {/* Compact Utility Bar (No duplicate title) */}
      <div style={styles.toolbar}>
        <div style={styles.breadcrumb}>
          <span style={styles.workspaceTag}>Workspace</span>
          <span style={styles.separator}>/</span>
          <span style={styles.boardName}>Sprint Board</span>
        </div>

        <div style={styles.statsGroup}>
          <span style={styles.statPill}>
            Total: <strong>{totalTasks}</strong>
          </span>
          <span style={styles.statPill}>
            Completed: <strong>{completedTasks}</strong>
          </span>
        </div>
      </div>

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
                title=""
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
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f8fafc',
    padding: '24px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
    color: '#0f172a',
    boxSizing: 'border-box'
  },
  toolbar: {
    maxWidth: 1200,
    margin: '0 auto 20px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14
  },
  workspaceTag: {
    color: '#64748b',
    fontWeight: 500
  },
  separator: {
    color: '#cbd5e1'
  },
  boardName: {
    color: '#0f172a',
    fontWeight: 600
  },
  statsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  statPill: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: 13,
    color: '#475569'
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
    borderRadius: 10,
    padding: 16,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
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
    color: '#1e293b'
  },
  countBadge: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 999
  }
}