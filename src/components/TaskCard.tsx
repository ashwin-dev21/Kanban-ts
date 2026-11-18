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
        background: 'white',
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        cursor: 'grab'
      }}
    >
      <p>{task.text}</p>
      <button onClick={() => deleteTask(type, task.id)}>Delete</button>
    </div>
  )
}