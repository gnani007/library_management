
export type Role = "user | admin"

export interface Book {
  id: string
  title: string
  author: string
  stock: number
}

export interface User {
  id: string
  name: string
  role: Role
  borrowedBooks: string[]
}