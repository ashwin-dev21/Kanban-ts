import { useState } from 'react'
import Column from './Column'
import useLocalStorage from '../hooks/useLocalStorage'
import type { Columns, Task } from '../types'

const initial: Columns = {
  todo: [],
  progress: [],
  done: []
}

export default function Board() {
  const [tasks, setTasks] = useLocalStorage<Columns>('tasks', initial)

  const [count, setCount] = useState({
    todo: tasks.todo.length,
    progress: tasks.progress.length,
    done: tasks.done.length
  })

  const updateCount = (data: Columns) => {
    setCount({
      todo: data.todo.length,
      progress: data.progress.length,
      done: data.done.length
    })
  }

  const addTask = (col: keyof Columns, text: string) => {
    if (!text.trim()) return
    const newTask: Task = { id: Date.now(), text }
    const updated = {
      ...tasks,
      [col]: [...tasks[col], newTask]
    }
    setTasks(updated)
    updateCount(updated)
  }

  const deleteTask = (col: keyof Columns, id: number) => {
    const updated = {
      ...tasks,
      [col]: tasks[col].filter(t => t.id !== id)
    }
    setTasks(updated)
    updateCount(updated)
  }

  const moveTask = (from: keyof Columns, to: keyof Columns, task: Task) => {
    if (from === to) return
    const updated = {
      ...tasks,
      [from]: tasks[from].filter(t => t.id !== task.id),
      [to]: [...tasks[to], task]
    }
    setTasks(updated)
    updateCount(updated)
  }

  return (
    <div style={styles.boardGrid}>
      <div style={styles.columnCard}>
        <Column
          title={`To Do (${count.todo})`}
          type="todo"
          tasks={tasks.todo}
          addTask={addTask}
          deleteTask={deleteTask}
          moveTask={moveTask}
        />
      </div>

      <div style={styles.columnCard}>
        <Column
          title={`In Progress (${count.progress})`}
          type="progress"
          tasks={tasks.progress}
          addTask={addTask}
          deleteTask={deleteTask}
          moveTask={moveTask}
        />
      </div>

      <div style={styles.columnCard}>
        <Column
          title={`Done (${count.done})`}
          type="done"
          tasks={tasks.done}
          addTask={addTask}
          deleteTask={deleteTask}
          moveTask={moveTask}
        />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  boardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
    alignItems: 'start',
    margin: 0,
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#18181b'
  },
  columnCard: {
    backgroundColor: '#fafafa',
    border: '1px solid #e4e4e7',
    borderRadius: 10,
    padding: 14
  }
}