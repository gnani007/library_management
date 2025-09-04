import "../styles/global.scss"
import "../styles/components/header.scss"
import { useAuth } from "../context/AuthContext"

const Header = () => {
  const { loginAs, state, logout } = useAuth()
  return (
    <div className="header-container">
      <h3>Library - Books Management</h3>
      <div className="cta-buttons">
        {state.user ? (
          <>
            <span>Hi, {state.user.name} ({state.user.role})</span>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => loginAs('user')}>Login as User</button>
            <button style={{ marginLeft: 8 }} onClick={() => loginAs('admin')}>Login as Admin</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header