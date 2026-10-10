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

      <style jsx global>{`
        * { box-sizing: border-box; }
        .home3d {
          --home-lime: #b6f36b;
          --home-purple: #c2a2ff;
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          padding: 0 clamp(20px, 7.8vw, 150px);
          color: #f4f5f8;
          background:
            radial-gradient(ellipse at 15% 20%, rgba(182,243,107,.055), transparent 31%),
            radial-gradient(ellipse at 85% 34%, rgba(170,126,255,.075), transparent 30%),
            #080a0e;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .home3d a { -webkit-tap-highlight-color: transparent; }
        .home3d-orb {
          position: absolute; z-index: -1; pointer-events: none;
          border-radius: 50%; filter: blur(80px); opacity: .2;
        }
        .home3d-orb-lime { width: 300px; height: 300px; top: 170px; left: -220px; background: #8de64b; }
        .home3d-orb-purple { width: 370px; height: 370px; top: 260px; right: -260px; background: #8d60e7; }
        .home3d-nav {
          min-height: 82px; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #282e3a; gap: 20px;
        }
        .home3d-brand {
          display: inline-flex; align-items: center; gap: 14px; color: #f5f5f7;
          text-decoration: none; font-weight: 900; font-size: 17px; letter-spacing: .17em;
        }
        .home3d-brand-mark {
          width: 48px; height: 48px; display: grid; place-items: center; border-radius: 15px;
          color: #10140c; font-size: 27px; letter-spacing: 0;
          background: linear-gradient(145deg, #d1ff93, #9bdc4d);
          box-shadow: 0 4px 0 #50772d, 0 9px 18px rgba(0,0,0,.38), inset 0 2px 0 rgba(255,255,255,.45);
        }
        .home3d-nav-label, .home3d-destination-count {
          color: #aab3c5; font-size: 11px; letter-spacing: .23em; font-weight: 800;
        }
        .home3d-hero {
          display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(330px, .85fr);
          align-items: center; gap: clamp(40px, 7vw, 112px); padding: clamp(64px, 8vw, 126px) 0 94px;
        }
        .home3d-hero-copy { position: relative; z-index: 1; }
        .home3d-eyebrow {
          display: flex; align-items: center; gap: 10px; margin: 0 0 25px;
          color: var(--home-lime); font-size: 11px; font-weight: 900; letter-spacing: .22em;
        }
        .home3d-eyebrow span { width: 7px; height: 7px; border-radius: 50%; background: var(--home-lime); box-shadow: 0 0 14px rgba(182,243,107,.8); }
        .home3d-hero h1 {
          margin: 0; font-size: clamp(54px, 7.2vw, 104px); font-weight: 720;
          line-height: .99; letter-spacing: -.075em; text-wrap: balance;
          text-shadow: 0 4px 0 rgba(0,0,0,.22);
        }
        .home3d-hero h1 span {
          display: inline-block; color: var(--home-lime);
          text-shadow: 0 2px 0 #557b32, 0 9px 25px rgba(182,243,107,.08);
        }
        .home3d-intro {
          max-width: 570px; margin: 28px 0 28px; color: #aeb8c9;
          font-size: clamp(15px, 1.25vw, 18px); line-height: 1.9;
        }
        .home3d-primary {
          display: inline-flex; align-items: center; justify-content: space-between; gap: 28px;
          min-height: 58px; padding: 0 22px; border-radius: 13px; color: #11150c;
          text-decoration: none; font-size: 14px; font-weight: 900;
          background: linear-gradient(145deg, #d0ff91, #a9eb5c);
          border: 1px solid rgba(226,255,194,.55);
          box-shadow: 0 5px 0 #5d8733, 0 12px 22px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.65);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .home3d-primary span { font-size: 20px; }
        .home3d-primary:hover { transform: translateY(-4px); box-shadow: 0 8px 0 #5d8733, 0 18px 30px rgba(0,0,0,.45), 0 0 25px rgba(182,243,107,.12); }
        .home3d-proof { display: flex; align-items: center; gap: 10px; margin-top: 23px; color: #777f90; font-size: 11px; }
        .home3d-proof-dot, .home3d-live-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--home-lime); box-shadow: 0 0 12px rgba(182,243,107,.7); }
        .home3d-visual {
          position: relative; min-height: 405px; display: grid; place-items: center; isolation: isolate;
          border: 1px solid rgba(180,160,226,.2); border-radius: 32px;
          background: linear-gradient(145deg, rgba(25,29,37,.95), rgba(10,12,17,.96));
          box-shadow: 0 5px 0 #050609, 0 12px 0 rgba(166,133,225,.08), 0 28px 60px rgba(0,0,0,.52), inset 0 1px 0 rgba(255,255,255,.09);
          transform: perspective(1100px) rotateY(-4deg) rotateX(2deg);
        }
        .home3d-visual-glow { position: absolute; inset: 10%; border-radius: 50%; background: radial-gradient(circle, rgba(182,243,107,.16), rgba(159,123,255,.07) 45%, transparent 70%); filter: blur(18px); }
        .home3d-orbit { position: absolute; width: 270px; height: 270px; border: 1px solid rgba(182,243,107,.18); border-radius: 50%; transform: rotateX(65deg) rotateZ(-25deg); }
        .home3d-orbit-two { width: 330px; height: 330px; border-color: rgba(192,162,255,.18); transform: rotateX(65deg) rotateZ(32deg); }
        .home3d-emblem {
          position: relative; z-index: 1; width: 150px; height: 150px; display: grid; place-items: center;
          border: 1px solid rgba(212,255,169,.72); border-radius: 42px; color: #17200e; font-size: 75px;
          background: linear-gradient(145deg, #d4ff9d, #91d64b);
          box-shadow: 0 8px 0 #4e742d, 0 22px 34px rgba(0,0,0,.45), 0 0 50px rgba(182,243,107,.12), inset 0 3px 0 rgba(255,255,255,.65);
          transform: rotate(-8deg) rotateY(-12deg);
        }
        .home3d-emblem span { transform: rotate(8deg); }
        .home3d-float-card {
          position: absolute; z-index: 2; display: flex; align-items: center; gap: 12px; padding: 13px 15px;
          border: 1px solid rgba(205,190,235,.22); border-radius: 15px;
          background: linear-gradient(145deg, rgba(36,38,47,.96), rgba(17,19,25,.97));
          box-shadow: 0 4px 0 #050609, 0 12px 22px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.08);
        }
        .home3d-float-card strong, .home3d-float-card small { display: block; }
        .home3d-float-card strong { color: #f4f3f8; font-size: 11px; }
        .home3d-float-card small { margin-top: 4px; color: #9ca5b7; font-size: 10px; }
        .home3d-mini-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: #2c3425; color: var(--home-lime); font-size: 20px; }
        .home3d-float-top { top: 62px; right: -25px; }
        .home3d-float-bottom { bottom: 65px; left: -28px; }
        .home3d-visual-caption { position: absolute; bottom: 20px; left: 24px; right: 24px; display: flex; justify-content: space-between; color: #747d8e; font-size: 9px; letter-spacing: .17em; }
        .home3d-portal { padding: 26px 0 90px; }
        .home3d-section-heading { display: flex; justify-content: space-between; align-items: end; gap: 25px; margin-bottom: 28px; }
        .home3d-section-heading .home3d-eyebrow { margin-bottom: 14px; }
        .home3d-section-heading h2 { margin: 0; font-size: clamp(30px, 3vw, 42px); font-weight: 650; letter-spacing: -.05em; }
        .home3d-section-subtitle { margin: 10px 0 0; color: #939cad; font-size: 14px; }
        .home3d-destination-count { padding-bottom: 8px; white-space: nowrap; }
        .home3d-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 23px; }
        .home3d-card {
          position: relative; min-height: 300px; display: flex; flex-direction: column; overflow: hidden;
          padding: 25px; border: 1px solid #303746; border-radius: 20px; color: inherit; text-decoration: none;
          background: linear-gradient(145deg, #191d26 0%, #11151d 60%, #0d1016 100%);
          box-shadow: 0 5px 0 #050609, 0 10px 0 rgba(160,142,202,.07), 0 21px 35px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.075);
          transform: perspective(1000px) translateZ(0);
          transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease;
        }
        .home3d-card::before { content: ""; position: absolute; left: 20px; right: 20px; top: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--card-accent), transparent); opacity: .8; }
        .home3d-card::after { content: ""; position: absolute; width: 180px; height: 180px; top: -120px; right: -95px; border-radius: 50%; background: var(--card-glow); filter: blur(22px); pointer-events: none; }
        .home3d-card-lime { --card-accent: #b6f36b; --card-glow: rgba(182,243,107,.17); }
        .home3d-card-purple { --card-accent: #c2a2ff; --card-glow: rgba(194,162,255,.17); }
        .home3d-card-blue { --card-accent: #8ecbff; --card-glow: rgba(142,203,255,.14); }
        .home3d-card:hover { transform: perspective(1000px) translateY(-8px) rotateX(1deg); border-color: var(--card-accent); box-shadow: 0 8px 0 #050609, 0 14px 0 rgba(160,142,202,.1), 0 30px 45px rgba(0,0,0,.52), 0 0 25px var(--card-glow), inset 0 1px 0 rgba(255,255,255,.12); }
        .home3d-card-top { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .home3d-card-number { color: var(--card-accent); font-size: 13px; font-weight: 900; }
        .home3d-card-tag { color: #8790a2; font-size: 9px; font-weight: 800; letter-spacing: .12em; text-align: right; }
        .home3d-card-icon { display: grid; place-items: center; width: 49px; height: 49px; margin: 26px 0 18px; border: 1px solid color-mix(in srgb, var(--card-accent) 40%, transparent); border-radius: 15px; color: var(--card-accent); font-size: 24px; background: linear-gradient(145deg, #282d36, #151820); box-shadow: 0 4px 0 #07090d, 0 8px 15px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.08); }
        .home3d-card h3 { position: relative; z-index: 1; margin: 0 0 12px; font-size: 23px; font-weight: 650; letter-spacing: -.035em; }
        .home3d-card p { position: relative; z-index: 1; margin: 0 0 26px; color: #a7b0c0; font-size: 13px; line-height: 1.85; }
        .home3d-card-action { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-top: auto; padding-top: 17px; border-top: 1px solid rgba(255,255,255,.09); font-size: 12px; font-weight: 850; }
        .home3d-card-arrow { color: var(--card-accent); font-size: 22px; transition: transform .2s ease; }
        .home3d-card:hover .home3d-card-arrow { transform: translateX(5px); }
        .home3d-footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 25px 0 29px; border-top: 1px solid #282e3a; color: #9aa4b7; font-size: 10px; letter-spacing: .15em; }
        .home3d-footer b { margin-left: 9px; color: var(--home-lime); }
        @media (max-width: 960px) {
          .home3d { padding: 0 28px; }
          .home3d-hero { grid-template-columns: 1fr; gap: 45px; padding: 70px 0; }
          .home3d-hero-copy { max-width: 760px; }
          .home3d-visual { width: min(100%, 600px); justify-self: center; }
          .home3d-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .home3d-card:last-child { grid-column: 1 / -1; }
        }
        @media (max-width: 620px) {
          .home3d { padding: 0 18px; }
          .home3d-nav { min-height: 70px; }
          .home3d-brand { font-size: 14px; gap: 10px; }
          .home3d-brand-mark { width: 40px; height: 40px; border-radius: 12px; }
          .home3d-nav-label { font-size: 9px; letter-spacing: .12em; }
          .home3d-hero { padding: 56px 0 60px; }
          .home3d-hero h1 { font-size: clamp(49px, 13vw, 72px); }
          .home3d-intro { font-size: 15px; line-height: 1.8; }
          .home3d-visual { min-height: 330px; border-radius: 24px; transform: none; }
          .home3d-emblem { width: 112px; height: 112px; border-radius: 32px; font-size: 56px; }
          .home3d-orbit { width: 215px; height: 215px; }
          .home3d-orbit-two { width: 260px; height: 260px; }
          .home3d-float-card { padding: 10px; gap: 8px; }
          .home3d-float-top { top: 35px; right: 8px; }
          .home3d-float-bottom { bottom: 46px; left: 8px; }
          .home3d-visual-caption { font-size: 8px; left: 14px; right: 14px; }
          .home3d-section-heading { align-items: flex-start; flex-direction: column; }
          .home3d-destination-count { padding: 0; }
          .home3d-grid { grid-template-columns: 1fr; gap: 18px; }
          .home3d-card:last-child { grid-column: auto; }
          .home3d-card { min-height: 275px; padding: 22px; }
          .home3d-footer { flex-direction: column; align-items: flex-start; font-size: 9px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .home3d *, .home3d *::before, .home3d *::after { transition: none !important; }
        }
      `}</style>
    </main>
  );
}
