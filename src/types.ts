export type Task = {
  id: number
  text: string
}

export type Columns = {
  todo: Task[]
  progress: Task[]
  done: Task[]
}