import { render, screen } from '@testing-library/react'
import BookList from './BookList'
import { AuthProvider } from '../context/AuthContext'

describe('BookList', () => {
  it('renders a book title', async () => {
    render(
      <AuthProvider>
        <BookList />
      </AuthProvider>
    )

    expect(await screen.findByText('React Typescript')).toBeInTheDocument()
  })
})
