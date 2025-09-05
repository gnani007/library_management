import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookServices } from "../services/bookServices"
import { Books } from '../types'
import { useApiError } from '../hooks/useApiError'

const BorrowedBookList = () => {
  const { state } = useAuth()
  const { error, setError, clear } = useApiError()
  const [books, setBooks] = useState<Books[]>([])

  const loadBooks = async () => {
    clear()
    try {
      if (!state.user) {
        setBooks([])
        return
      }
      // Get all books first
      const all = await bookServices.getBooks()
      console.log(all, "test all")
      // Pick only borrowed ones
      const borrowed = all.filter(b => state.user!.borrowedBooks.includes(b.id))
      setBooks(borrowed)
    } catch (e) {
      setError(e)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [state.user, state?.user?.borrowedBooks])

  if (!state.user) return null

  return (
    <div className='borrow-book-list'>
      <h4>Your Borrowed Books</h4>
      {error && <div className="error">{error}</div>}
      <ul>
        {books.length === 0 && <li>No borrowed books</li>}
        {books.map(book => <li key={book.id}>{book?.title} by {book?.author}</li>)}
      </ul>
    </div>
  )
}

export default BorrowedBookList