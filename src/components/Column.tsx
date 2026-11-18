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

export default function Column({ title, type, tasks, addTask, deleteTask, moveTask }: Props) {
  const [input, setInput] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

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

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleAdd = () => {
    if (!input.trim()) return
    addTask(type, input)
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
        backgroundColor: isDragOver ? '#f0f0f2' : 'transparent',
        borderColor: isDragOver ? '#a1a1aa' : '#e4e4e7'
      }}
    >
      <h3 style={styles.title}>{title}</h3>

      {/* Input Form Group */}
      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Add new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={styles.input}
        />
        <button onClick={handleAdd} style={styles.button}>
          +
        </button>
      </div>

      {/* Tasks Container */}
      <div style={styles.taskList}>
        {tasks.length === 0 ? (
          <p style={styles.emptyText}>No tasks yet</p>
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
    boxSizing: 'border-box',
    transition: 'background-color 0.2s ease, border-color 0.2s ease'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#3f3f46',
    letterSpacing: '-0.01em'
  },
  inputGroup: {
    display: 'flex',
    gap: 6,
    marginBottom: 14
  },
  input: {
    flex: 1,
    padding: '7px 10px',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
    border: '1px solid #d4d4d8',
    borderRadius: 6,
    outline: 'none',
    color: '#18181b',
    transition: 'border-color 0.15s ease'
  },
  button: {
    padding: '0 12px',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#18181b',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 40
  },
  emptyText: {
    margin: '8px 0 0 0',
    fontSize: '0.8rem',
    color: '#a1a1aa',
    fontStyle: 'italic',
    textAlign: 'center'
  }
}