export function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <img src="/snakes.svg" alt="" width={40} height={40} className="brand-icon" />
        <div>
          <h1 className="brand-title">Cordoval Snakes</h1>
          <p className="brand-tagline">A private browser snake game</p>
        </div>
      </div>
    </header>
  )
}
