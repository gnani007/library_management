import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookList from './BookList'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { bookServices } from '../services/bookServices'
import { vi } from 'vitest'

// Mocked user for tests
const mockUser = { id: 'u1', borrowedBooks: [] }

// Helper component to set user in AuthContext
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuth()
  React.useEffect(() => {
    setUser({ ...mockUser })
  }, [])
  return <>{children}</>
}

// Sample books
const mockBooks = [
  { id: 'b1', title: 'React Typescript', author: 'Alex', stock: 3 },
  { id: 'b2', title: 'NodeJS Basics', author: 'John', stock: 0 },
]

describe('BookList', () => {
  // Spies
  beforeAll(() => {
    vi.spyOn(bookServices, 'getBooks')
    vi.spyOn(bookServices, 'borrowBook')
    vi.spyOn(bookServices, 'returnBook')
  })

  beforeEach(() => {
    // Reset borrowedBooks
    mockUser.borrowedBooks = []

    // Mock implementations
    bookServices.getBooks.mockResolvedValue(mockBooks)
    bookServices.borrowBook.mockImplementation(async (userId, bookId) => {
      const book = mockBooks.find(b => b.id === bookId)!
      mockUser.borrowedBooks.push(bookId)
      book.stock -= 1
      return { user: mockUser, book }
    })
    bookServices.returnBook.mockImplementation(async (userId, bookId) => {
      const book = mockBooks.find(b => b.id === bookId)!
      const index = mockUser.borrowedBooks.indexOf(bookId)
      if (index > -1) mockUser.borrowedBooks.splice(index, 1)
      book.stock += 1
      return { user: mockUser, book }
    })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders all books and Borrow/Return buttons correctly', async () => {
    render(
      <AuthProvider>
        <AuthWrapper>
          <BookList />
        </AuthWrapper>
      </AuthProvider>
    )

    // Check book titles
    expect(await screen.findByText('React Typescript')).toBeTruthy()
    expect(screen.getByText('NodeJS Basics')).toBeTruthy()

    // Borrow button appears only for available books not borrowed
    expect(screen.getByText('Borrow')).toBeTruthy()

    // Book with 0 stock should not have Borrow button
    expect(screen.queryByText('Return')).toBeNull()
  })

  it('borrows a book and updates user borrowedBooks', async () => {
    render(
      <AuthProvider>
        <AuthWrapper>
          <BookList />
        </AuthWrapper>
      </AuthProvider>
    )

    const borrowBtn = await screen.findByText('Borrow')
    fireEvent.click(borrowBtn)

    await waitFor(() => {
      expect(mockUser.borrowedBooks).toContain('b1')
      expect(screen.getByText('Return')).toBeTruthy()
    })
  })

  it('returns a book and updates user borrowedBooks', async () => {
    // Add book to borrowed list first
    mockUser.borrowedBooks.push('b1')

    render(
      <AuthProvider>
        <AuthWrapper>
          <BookList />
        </AuthWrapper>
      </AuthProvider>
    )

    const returnBtn = await screen.findByText('Return')
    fireEvent.click(returnBtn)

    await waitFor(() => {
      expect(mockUser.borrowedBooks).not.toContain('b1')
      expect(screen.getByText('Borrow')).toBeTruthy()
    })
  })
})
