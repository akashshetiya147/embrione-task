"use client";

import Link from "next/link";

const destinations = [
  {
    number: "01",
    title: "Join the Team",
    description: "Create your member profile and preview your Embrione identity card.",
    action: "Register now",
    href: "/register",
    accent: "lime",
    tag: "YOUR NEXT CHAPTER",
  },
  {
    number: "02",
    title: "Admin Dashboard",
    description: "Review applications, manage submissions, and make member approval decisions.",
    action: "Open dashboard",
    href: "/admin",
    accent: "purple",
    tag: "ADMIN ACCESS",
  },
  {
    number: "03",
    title: "Meet the Team",
    description: "Discover the people, domains, and talents building the Embrione community.",
    action: "Explore members",
    href: "/team",
    accent: "blue",
    tag: "OUR COMMUNITY",
  },
];

export default function HomePage() {
  return (
    <main className="home3d">
      <div className="home3d-orb home3d-orb-lime" aria-hidden="true" />
      <div className="home3d-orb home3d-orb-purple" aria-hidden="true" />

      <header className="home3d-nav">
        <Link href="/" className="home3d-brand" aria-label="Embrione home">
          <span className="home3d-brand-mark" aria-hidden="true">✦</span>
          <span>EMBRIONE</span>
        </Link>
        <span className="home3d-nav-label">MEMBER PORTAL</span>
      </header>

      <section className="home3d-hero">
        <div className="home3d-hero-copy">
          <p className="home3d-eyebrow"><span /> PES UNIVERSITY · CSE</p>
          <h1>
            People make
            <br />
            <span>the difference.</span>
          </h1>
          <p className="home3d-intro">
            One community. Different talents. A shared vision. Meet the people
            building something meaningful at Embrione.
          </p>
          <Link href="/register" className="home3d-primary">
            Become a member <span aria-hidden="true">↗</span>
          </Link>
          <div className="home3d-proof">
            <span className="home3d-proof-dot" />
            A place for ideas, people, and possibilities
          </div>
        </div>

        <div className="home3d-visual" aria-label="Embrione community highlight">
          <div className="home3d-visual-glow" />
          <div className="home3d-orbit home3d-orbit-one" />
          <div className="home3d-orbit home3d-orbit-two" />
          <div className="home3d-emblem">
            <span>✦</span>
          </div>
          <div className="home3d-float-card home3d-float-top">
            <span className="home3d-mini-icon">✳</span>
            <span><strong>One community</strong><small>Many kinds of brilliance</small></span>
          </div>
          <div className="home3d-float-card home3d-float-bottom">
            <span className="home3d-live-dot" />
            <span><strong>Build something real</strong><small>Grow together at Embrione</small></span>
          </div>
          <div className="home3d-visual-caption">
            <span>EST. FOR CREATORS</span>
            <span>01 / COMMUNITY</span>
          </div>
        </div>
      </section>

      <section className="home3d-portal">
        <div className="home3d-section-heading">
          <div>
            <p className="home3d-eyebrow">YOUR NEXT STEP</p>
            <h2>Explore the portal</h2>
            <p className="home3d-section-subtitle">
              Choose where you want to go next.
            </p>
          </div>
          <span className="home3d-destination-count">03 DESTINATIONS</span>
        </div>

        <div className="home3d-grid">
          {destinations.map((item) => (
            <Link
              href={item.href}
              key={item.number}
              className={`home3d-card home3d-card-${item.accent}`}
            >
              <div className="home3d-card-top">
                <span className="home3d-card-number">{item.number}</span>
                <span className="home3d-card-tag">{item.tag}</span>
              </div>
              <div className="home3d-card-icon" aria-hidden="true">
                {item.number === "01" ? "↗" : item.number === "02" ? "⌘" : "✳"}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="home3d-card-action">
                <span>{item.action}</span>
                <span className="home3d-card-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="home3d-footer">
        <span>EMBRIONE · PES UNIVERSITY</span>
        <span>BUILT BY THE COMMUNITY <b>✦</b></span>
      </footer>

        </main>
  );
}
