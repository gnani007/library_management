import { useEffect, useState } from 'react'
import type { Books } from '../types'
import { bookServices } from "../services/bookServices"
import "../styles/components/book_list.scss"

const BookList = () => {
  const [loading, setLoading] = useState(false)
  const [bookList, setBookList] = useState<Books[]>([])
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

  console.log(bookList, "test book list")

  return (
    <div className="book-list-section">
      <h4>Books</h4>
      {loading && <div>Loading...</div>}
      <div className='book-list'>
        {bookList.map(book => (
          <div className='row'>
            <div className='book-details'>
              <div className='book-title'>{book.title}</div>
              <div className='author'>{book.author}</div>
            </div>
            <div className='qty'>{book.stock}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookList