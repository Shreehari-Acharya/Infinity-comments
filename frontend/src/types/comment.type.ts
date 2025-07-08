interface User {
  username: string
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: User
  replies: string[]
  repliesCount: number
}