import type { Task, Columns } from '../types'

type Props = {
  task: Task
  type: keyof Columns
  deleteTask: (c: keyof Columns, id: number) => void
}

export default function TaskCard({ task, type, deleteTask }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('task', JSON.stringify(task))
    e.dataTransfer.setData('from', type)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        marginTop: 10,
        padding: '10px 12px',
        borderRadius: 8,
        cursor: 'grab',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: '#0f172a',
          lineHeight: 1.4,
          wordBreak: 'break-word'
        }}
      >
        {task.text}
      </p>

      <button
        type="button"
        className="btn-delete"
        onClick={e => {
          e.stopPropagation()
          deleteTask(type, task.id)
        }}
        aria-label={`Delete ${task.text}`}
        style={{ flexShrink: 0 }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
        Delete
      </button>
    </div>
  )
}