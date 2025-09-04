import { User, Books } from "../types"

let books: Books[] = [
  { id: '1', title: 'React Basics', author: 'John Doe', stock: 2 },
  { id: '2', title: 'TypeScript Guide', author: 'Jane Smith', stock: 1 },
]

let users: Users = [
  { id: 'u1', name: 'Alice', role: 'user', borrowedBooks: [] },
  { id: 'a1', name: 'Admin', role: 'admin', borrowedBooks: [] },
]