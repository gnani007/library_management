import './App.scss'
import Header from './components/Header'
import BookList from './components/BookList'
import BorrowedBookList from './components/BorrowedBookList'

function App() {
  return (
    <div className='library-main-container'>
      <Header />
      <div className='book-llist-container'>
        <BookList />
        <BorrowedBookList />
      </div>
    </div>
  )
}

export default App
