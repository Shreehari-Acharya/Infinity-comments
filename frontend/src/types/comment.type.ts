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


interface Parent {
  user: User
}

export interface MyComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: User
  parent: Parent | null
  replies: { id: string }[]
  repliesCount: number
  parentUsername: string | null
}
