import React, { useEffect, useState } from 'react'
import { Books, User } from '../types'
import { bookServices } from '../services/bookServices'
import { useApiError } from '../hooks/useApiError'
import "../styles/components/admin_panel.scss"
const AdminPanel = () => {
  const { error, setError, clear } = useApiError()
  const [books, setBooks] = useState<Books[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [stock, setStock] = useState(1)

  const loadData = async () => {
    clear()
    try {
      const [allBooks, allUsers] = await Promise.all([
        bookServices.getBooks(),
        bookServices.getUsers()
      ])
      setBooks(allBooks)
      setUsers(allUsers)
    } catch (e) {
      setError(e)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleAddBook = async () => {
    clear()
    if (!title || !author || stock <= 0) return setError('Fill all fields correctly')
    try {
      await bookServices.addBook({ id: Date.now().toString(), title, author, stock })
      setTitle(''); setAuthor(''); setStock(1)
      await loadData()
    } catch (e) { setError(e) }
  }

  const handleUpdateStock = async (bookId: string, newStock: number) => {
    clear()
    try {
      await bookServices.updateStock(bookId, newStock)
      await loadData()
    } catch (e) { setError(e) }
  }

  return (
    <div className='admin-panel-container'>
      <h2>Admin Dashboard</h2>
      {error && <div className="error">{error}</div>}

      {/* Add New Book */}
      <div className='add-new-books'>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} style={{ width: 80 }} />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      {/* Inventory Table */}
      <div>
        <h3>Inventory</h3>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Title</th>
              <th>Author</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.stock}</td>
                <td>
                  <button onClick={() => handleUpdateStock(b.id, b.stock + 1)}>+1</button>
                  <button onClick={() => handleUpdateStock(b.id, Math.max(0, b.stock - 1))} style={{ marginLeft: 4 }}>-1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Borrowed Books Table */}
      <div>
        <h3>Borrowed Books</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Borrowed Books</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{u.name} ({u.role})</td>
                <td>{u.borrowedBooks.length > 0 ? u.borrowedBooks.map(id => {
                  const book = books.find(b => b.id === id)
                  return book ? book.title : 'Unknown'
                }).join(', ') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPanel
