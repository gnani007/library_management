import { useEffect, useState } from 'react'
import type { Books } from '../types'
import { bookServices } from "../services/bookServices"
import "../styles/components/book_list.scss"
import { useAuth } from '../context/AuthContext'
import { useApiError } from '../hooks/useApiError'

const BookList = () => {
  const [loading, setLoading] = useState(false)
  const [bookList, setBookList] = useState<Books[]>([])
  const { error, setError, clear } = useApiError()
  const { state, setUser } = useAuth()

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    setLoading(true)
    try {
      const bookArr = await bookServices.getBooks();
      setBookList(bookArr)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleBorrow = async (bookId: string) => {
    if (!state.user) return setError('Not authenticated (401)')
    clear()
    try {
      const { user } = await bookServices.borrowBook(state.user.id, bookId)
      setUser(user) // update AuthContext
      await loadBooks()
    } catch (e) {
      setError(e)
    }
  }

  const handleReturn = async (bookId: string) => {
    if (!state.user) return setError('Not authenticated (401)')
    clear()
    try {
      const { user } = await bookServices.returnBook(state.user.id, bookId)
      setUser(user) // update AuthContext
      await loadBooks()
    } catch (e) {
      setError(e)
    }
  }

  console.log(bookList, "test book list")

  return (
    <div className="book-list-section">
      <h4>Books</h4>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      <div className='book-list'>
        {bookList.map(book => (
          <div className='row' key={book.id}>
            <div className='book-details'>
              <div className='book-title'>{book.title}</div>
              <div className='author'>{book.author}</div>
            </div>
            <div className='qty'>{book.stock > 0 ? book.stock : 'Not Available'}</div>
            <div className="borrow-actions">
              {state.user && !state.user.borrowedBooks.includes(book.id) && book.stock > 0 && (
                <button onClick={() => handleBorrow(book.id)}>Borrow</button>
              )}
              {state.user && state.user.borrowedBooks.includes(book.id) && (
                <button onClick={() => handleReturn(book.id)}>Return</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookList