import { useState } from 'react'
import TaskCard from './TaskCard'
import type { Columns, Task } from '../types'

type Props = {
  title: string
  type: keyof Columns
  tasks: Task[]
  addTask: (c: keyof Columns, t: string) => void
  deleteTask: (c: keyof Columns, id: number) => void
  moveTask: (f: keyof Columns, t: keyof Columns, task: Task) => void
}

const ACCENTS: Record<keyof Columns, string> = {
  todo: '#6366f1',
  progress: '#f59e0b',
  done: '#10b981'
}

export default function Column({ title, type, tasks, addTask, deleteTask, moveTask }: Props) {
  const [input, setInput] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Split "To Do (3)" into label + badge count cleanly
  const match = title.match(/^(.*?)\s*\((\d+)\)$/)
  const label = match ? match[1] : title
  const count = match ? match[2] : tasks.length
  const accent = ACCENTS[type] || '#18181b'

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const task = JSON.parse(e.dataTransfer.getData('task'))
      const from = e.dataTransfer.getData('from') as keyof Columns

      if (from && from !== type) {
        moveTask(from, type, task)
      }
    } catch (err) {
      console.error('Failed to parse dropped task', err)
    }
  }

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  // Only clear drag state when leaving the column container itself, not child elements
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleAdd = () => {
    if (!input.trim()) return
    addTask(type, input.trim())
    setInput('')
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={allowDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      style={{
        ...styles.column,
        backgroundColor: isDragOver ? '#f4f4f5' : 'transparent',
        outline: isDragOver ? `2px dashed ${accent}` : '2px dashed transparent'
      }}
    >
      {/* Header with Status Dot & Pill Counter */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{ ...styles.dot, backgroundColor: accent }} />
          <h3 style={styles.title}>{label}</h3>
        </div>
        <span style={styles.badge}>{count}</span>
      </div>

      {/* Input Form Group */}
      <div
        style={{
          ...styles.inputGroup,
          borderColor: isFocused ? '#18181b' : '#e4e4e7',
          boxShadow: isFocused ? '0 0 0 3px rgba(24, 24, 27, 0.06)' : '0 1px 2px rgba(0, 0, 0, 0.03)'
        }}
      >
        <input
          type="text"
          placeholder="Add a task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={styles.input}
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          title="Add task"
          style={{
            ...styles.button,
            opacity: input.trim() ? 1 : 0.35,
            cursor: input.trim() ? 'pointer' : 'default'
          }}
        >
          +
        </button>
      </div>

      {/* Tasks Container */}
      <div style={styles.taskList}>
        {tasks.length === 0 ? (
          <div
            style={{
              ...styles.emptyState,
              borderColor: isDragOver ? accent : '#e4e4e7',
              color: isDragOver ? '#18181b' : '#a1a1aa'
            }}
          >
            {isDragOver ? 'Drop to move here' : 'No tasks yet'}
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              type={type}
              deleteTask={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: 220,
    padding: 4,
    borderRadius: 8,
    outlineOffset: 4,
    boxSizing: 'border-box',
    transition: 'background-color 0.15s ease, outline-color 0.15s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0
  },
  title: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#18181b',
    letterSpacing: '-0.01em'
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#52525b',
    backgroundColor: '#e4e4e7',
    padding: '2px 8px',
    borderRadius: 999
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e4e4e7',
    borderRadius: 8,
    padding: 3,
    marginBottom: 14,
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: '6px 8px',
    fontSize: '0.85rem',
    color: '#18181b'
  },
  button: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 500,
    lineHeight: 1,
    backgroundColor: '#18181b',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    transition: 'opacity 0.15s ease, transform 0.1s ease'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    border: '1px dashed #e4e4e7',
    borderRadius: 8,
    fontSize: '0.8rem',
    color: '#a1a1aa',
    transition: 'border-color 0.15s ease, color 0.15s ease'
  }
}