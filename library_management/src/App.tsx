import './App.scss'
import Header from './components/Header'
import BookList from './components/BookList'
import BorrowedBookList from './components/BorrowedBookList'
import AdminPanel from './components/AdminPanel'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

function App() {
  return (
    <div className='library-main-container'>
      <Header />
      <div className='book-llist-container'>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <BookList />
                <BorrowedBookList />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPanel />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
