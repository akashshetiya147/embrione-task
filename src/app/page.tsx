
import Link from "next/link";

const pages = [
  {
    number: "01",
    title: "Join the Team",
    description:
      "Create your member profile and preview your Embrione identity card.",
    href: "/register",
    label: "Register now",
  },
  {
    number: "02",
    title: "Admin Dashboard",
    description:
      "Review applications and manage member approvals.",
    href: "/admin",
    label: "Open dashboard",
  },
  {
    number: "03",
    title: "Meet the Team",
    description:
      "Discover the people, domains and talents behind Embrione.",
    href: "/team",
    label: "Explore members",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="navbar">
        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          EMBRIONE
        </Link>
        <span className="nav-caption">MEMBER PORTAL</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">PES UNIVERSITY · CSE</p>
        <h1>
          People make
          <br />
          <span>the difference.</span>
        </h1>
        <p className="hero-description">
          One community. Different talents. A shared vision.
          Meet the people building something meaningful at Embrione.
        </p>
        <Link href="/register" className="primary-button">
          Become a member <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="portal-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR NEXT STEP</p>
            <h2>Explore the portal</h2>
          </div>
          <span className="section-count">03 DESTINATIONS</span>
        </div>

        <div className="portal-grid">
          {pages.map((page) => (
            <article className="portal-card" key={page.number}>
              <span className="card-number">{page.number}</span>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <Link href={page.href} className="text-link">
                {page.label} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>EMBRIONE · PES UNIVERSITY</span>
        <span>BUILT BY THE COMMUNITY</span>
      </footer>
    </main>
  );
}
