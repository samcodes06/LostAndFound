import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">

      <nav className="landing-navbar">
        <h2>Lost & Found</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="landing-main">
        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <div className="hero-content">
          <h1>Lost or Found Something?</h1>

          <p>
            A simple and secure way to reconnect people
            with their lost belongings.
          </p>
        </div>
      </main>

    </div>
  );
}

export default LandingPage;