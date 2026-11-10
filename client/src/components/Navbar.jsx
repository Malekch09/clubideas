function Navbar({ user, onLogout, onShowAuth }) {
  return (
    <nav className="navbar">
      <div className="logo">
        🎓 Club<span>Ideas</span>
      </div>
      {user ? (
        <div className="nav-right">
          <span className="user-pill">👤 {user.name}</span>
          <button className="secondary" onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={onShowAuth}>Login / Register</button>
      )}
    </nav>
  );
}

export default Navbar;