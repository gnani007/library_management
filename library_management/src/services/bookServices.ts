import { backend } from "../api/mockBackend"
import type { Books } from '../types'

export const bookServices = {
  getBooks: () => backend.getBooks(),
  borrowBook: (userId: string, bookId: string) => backend.borrowBook(userId, bookId),
  returnBook: (userId: string, bookId: string) => backend.returnBook(userId, bookId),
  addBook: (book: Books) => backend.addBook(book),
  updateStock: (bookId: string, stock: number) => backend.updateStock(bookId, stock),
  getUsers: () => backend.getUsers()
}