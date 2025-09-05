import './App.scss'
import Header from './components/Header'
import BookList from './components/BookList'
import BorrowedBookList from './components/BorrowedBookList'
import AdminPanel from './components/AdminPanel'
import { useAuth } from './context/AuthContext'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

function App() {
  const { state } = useAuth()
  return (
    <div className='library-main-container'>
      <Header />
      {state.user?.role === 'admin' && (
        <div className='admin-breadcrumb'>
          <Link to="/">Go back</Link> <span>|</span>
          <Link to="/admin">Go to Admin Panel</Link>
        </div>
      )}
      <div className='book-list-container'>
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
              state.user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
