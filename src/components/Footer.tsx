export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Cordoval Snakes keeps your high score on this device only. No accounts, no third-party ads.
      </p>
      <nav className="footer-nav" aria-label="Legal">
        <a href="https://scrub.cordoval.co.uk/terms" rel="noopener noreferrer">
          Terms
        </a>
        <span className="footer-sep" aria-hidden="true">·</span>
        <a href="https://scrub.cordoval.co.uk/privacy" rel="noopener noreferrer">
          Privacy
        </a>
      </nav>
      <p className="footer-brand">
        <a href="https://cordoval.co.uk" rel="noopener noreferrer">Cordoval</a>
      </p>
    </footer>
  )
}
