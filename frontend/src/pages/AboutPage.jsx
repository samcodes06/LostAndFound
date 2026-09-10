import "../styles/AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="about-glow"></div>

        <div className="about-content">
          <h1>About Lost & Found</h1>

          <p>
            Lost & Found is a simple platform designed to help people
            reconnect with their lost belongings safely and efficiently.
          </p>
        </div>
      </section>

      <section className="how-it-works">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step-card">
            <span>01</span>
            <h3>Report</h3>
            <p>Post details about a lost or found item.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>Search</h3>
            <p>Browse available items and find possible matches.</p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Claim</h3>
            <p>Submit a secure claim for the item you believe is yours.</p>
          </div>

          <div className="step-card">
            <span>04</span>
            <h3>Recover</h3>
            <p>Complete the verification process and recover your item.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default AboutPage;