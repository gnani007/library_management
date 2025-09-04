import './App.scss'

function App() {
  return (
    <div className='library-main-container'>
      <h3>Library - Books Management</h3>
      <div>
        <button>Login as User</button>
        <button>Login as Admin</button>
      </div>
      <div className='book-llist-container'>
        <h4>Books</h4>
        <div className='book-list'>
          <div className='row'>
            <div className='book-title'>Master in frontend</div>
            <div className='author'>Alex Don</div>
          </div>
          <div className='row'>
            <div className='book-title'>Master in frontend</div>
            <div className='author'>Alex Don</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
