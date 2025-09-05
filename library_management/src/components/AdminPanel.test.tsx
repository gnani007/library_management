import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { vi } from 'vitest'
import AdminPanel from './AdminPanel'
import { bookServices } from '../services/bookServices'
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'

// Mock users and books
const mockUsers = [
  { id: 'u1', name: 'Alice', role: 'user', borrowedBooks: ['b1'] },
  { id: 'u2', name: 'Bob', role: 'user', borrowedBooks: [] },
]

const mockBooks = [
  { id: 'b1', title: 'React Typescript', author: 'Alex', stock: 3 },
  { id: 'b2', title: 'NodeJS Basics', author: 'John', stock: 0 },
]

// Mock Admin user
const adminUser = { id: 'admin1', name: 'Admin', role: 'admin', borrowedBooks: [] }
const AdminWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuth()
  React.useEffect(() => setUser(adminUser), [])
  return <>{children}</>
}

describe('AdminPanel', () => {
  beforeAll(() => {
    vi.spyOn(bookServices, 'getBooks')
    vi.spyOn(bookServices, 'getUsers')
    vi.spyOn(bookServices, 'addBook')
    vi.spyOn(bookServices, 'updateStock')
  })

  beforeEach(() => {
    bookServices.getBooks.mockResolvedValue([...mockBooks])
    bookServices.getUsers.mockResolvedValue([...mockUsers])
    bookServices.addBook.mockResolvedValue(undefined)
    bookServices.updateStock.mockResolvedValue(undefined)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('renders books and users tables', async () => {
    render(
      <AuthProvider>
        <AdminWrapper>
          <AdminPanel />
        </AdminWrapper>
      </AuthProvider>
    )

    // Wait for inventory rows
    const inventoryRows = await screen.findAllByRole('row')
    expect(inventoryRows.length).toBeGreaterThan(1) // includes header row

    // Check book titles
    const bookTitles = await screen.findAllByText(/React Typescript|NodeJS Basics/)
    expect(bookTitles.length).toBeGreaterThanOrEqual(2)

    // Wait for users table rows
    const usersRows = await screen.findAllByRole('row')
    expect(usersRows.length).toBeGreaterThanOrEqual(3) // header + 2 users
  })

  it('allows admin to add a new book', async () => {
    render(
      <AuthProvider>
        <AdminWrapper>
          <AdminPanel />
        </AdminWrapper>
      </AuthProvider>
    )

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Vue Basics' } })
    fireEvent.change(screen.getByPlaceholderText('Author'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: 5 } }) // stock

    fireEvent.click(screen.getByText('Add Book'))

    await waitFor(() => {
      expect(bookServices.addBook).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Vue Basics',
          author: 'Jane',
          stock: 5,
        })
      )
    })
  })

  it('allows admin to update stock', async () => {
    render(
      <AuthProvider>
        <AdminWrapper>
          <AdminPanel />
        </AdminWrapper>
      </AuthProvider>
    )

    // Wait for the inventory table rows to appear
    const tables = await screen.findAllByRole('table')
    // Inventory table is the first one (borrowed books is second)
    const inventoryTable = tables[0]

    // Get all rows inside inventory table
    const rows = within(inventoryTable).getAllByRole('row')
    const firstBookRow = rows[1] // skip header

    const plusBtn = within(firstBookRow).getByText('+1')
    const minusBtn = within(firstBookRow).getByText('-1')

    // Click +1 button
    fireEvent.click(plusBtn)
    await waitFor(() => expect(bookServices.updateStock).toHaveBeenCalledWith('b1', 4))

    // Click -1 button
    fireEvent.click(minusBtn)
    await waitFor(() => expect(bookServices.updateStock).toHaveBeenCalledWith('b1', 2))
  })


  it('shows error if add book form is invalid', async () => {
    render(
      <AuthProvider>
        <AdminWrapper>
          <AdminPanel />
        </AdminWrapper>
      </AuthProvider>
    )

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: '' } })
    fireEvent.change(screen.getByPlaceholderText('Author'), { target: { value: '' } })
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: 0 } })

    fireEvent.click(screen.getByText('Add Book'))

    await waitFor(() => {
      expect(screen.getByText('Fill all fields correctly')).toBeTruthy()
    })
  })
})
