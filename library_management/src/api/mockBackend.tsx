import type { Books, User } from "../types"

const books: Books[] = [
  { id: '100', title: 'React Typescript', author: 'Alex ', stock: 2 },
  { id: '101', title: 'React Mastering', author: 'Jonnathan', stock: 1 },
]

const users: User[] = [
  { id: 'U100', name: 'Brahmisha', role: 'user', borrowedBooks: [] },
  { id: 'A100', name: 'Gnan', role: 'admin', borrowedBooks: [] },
]
// simulate api delay
const wait = (ms = 200) => new Promise(res => setTimeout(res, ms))

export const backend = {
  async getBooks(): Promise<Books[]> {
    await wait()
    // return deep copy to avoid mutation from callers
    return JSON.parse(JSON.stringify(books))
  },


  async getUsers(): Promise<User[]> {
    await wait()
    return JSON.parse(JSON.stringify(users))
  },

  async borrowBook(userId: string, bookId: string) {
    await wait()
    const user = users.find(u => u.id === userId)
    const book = books.find(b => b.id === bookId)
    if (!user) throw { status: 401, message: 'User not found' }
    if (!book || book.stock <= 0) throw { status: 400, message: 'Book not available' }
    if (user.borrowedBooks.length >= 2) throw { status: 403, message: 'Borrow limit reached (2)' }
    if (user.borrowedBooks.includes(bookId)) throw { status: 403, message: 'User already borrowed this book' }
    // mutate backend state
    book.stock = Math.max(0, book.stock - 1)
    user.borrowedBooks.push(book.id)
    // eslint-disable-next-line no-debugger
    return { book: { ...book }, user: { ...user } }
  },



  async returnBook(userId: string, bookId: string) {
    await wait()
    const user = users.find(u => u.id === userId)
    const book = books.find(b => b.id === bookId)
    if (!user) throw { status: 401, message: 'User not found' }
    if (!book) throw { status: 400, message: 'Book not found' }
    if (!user.borrowedBooks.includes(bookId)) throw { status: 400, message: 'Book not borrowed by user' }
    // protect against over-returning by ensuring stock increments only once per return
    book.stock = book.stock + 1
    user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId)
    return { book: { ...book }, user: { ...user } }
  },

  async addBook(newBook: Books) {
    await wait()
    books.push({ ...newBook })
    return { ...newBook }
  },

  async updateStock(bookId: string, stock: number) {
    await wait()
    const book = books.find(b => b.id === bookId)
    if (!book) throw { status: 400, message: 'Book not found' }
    book.stock = Math.max(0, stock)
    return { ...book }
  }
}
