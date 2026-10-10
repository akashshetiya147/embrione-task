
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  domain: string;
  position: string;
  srn: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  branch: string;
  semester: number;
  bio: string;
  photo_url: string;
  status: string;
};

const domains = [
  "All Domains",
  "Web Development",
  "Design",
  "Logistics",
  "Operations",
  "Sponsorship",
  "Hospitality",
  "Social Media",
  "Event Management",
];

const positions = [
  "All Positions",
  "Head",
  "Vice-Head",
  "Core Member",
  "Member",
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [domain, setDomain] = useState("All Domains");
  const [position, setPosition] = useState("All Positions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Unable to load the team. Please try again later.");
      } else {
        setMembers((data ?? []) as Member[]);
      }

      setLoading(false);
    }

    void fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const matchesDomain =
      domain === "All Domains" || member.domain === domain;

    const matchesPosition =
      position === "All Positions" || member.position === position;

    return matchesDomain && matchesPosition;
  });

  return (
    <main className="team-page">
      <header className="team-header">
        <a href="/" className="team-back" aria-label="Back to Home">
          <span aria-hidden="true">←</span> Back to Home
        </a>

        <p className="team-eyebrow">EMBRIONE · OUR PEOPLE</p>

        <h1 className="team-title">
          Meet the <span>Team.</span>
        </h1>

        <p className="team-description">
          The people, ideas, and passion behind Embrione.
          Get to know the members building our community.
        </p>

        <div className="team-count">
          <strong>{members.length}</strong>
          <span>Approved Members</span>
        </div>
      </header>

      <section className="team-content">
        <div className="team-toolbar">
          <div>
            <h2>Our Members</h2>
            <p>Discover the people behind every initiative.</p>
          </div>

          <div className="team-filters">
            <label>
              <span>Domain</span>
              <select
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
              >
                {domains.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Position</span>
              <select
                value={position}
                onChange={(event) => setPosition(event.target.value)}
              >
                {positions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading && (
          <p className="team-message">Loading our team...</p>
        )}

        {!loading && error && (
          <p className="team-message">{error}</p>
        )}

        {!loading && !error && filteredMembers.length === 0 && (
          <div className="team-empty">
            <h3>No members found</h3>
            <p>
              No approved members match these filters yet.
              Try selecting another domain or position.
            </p>
          </div>
        )}

        {!loading && !error && filteredMembers.length > 0 && (
          <div className="team-grid">
            {filteredMembers.map((member) => (
              <article className="team-card" key={member.id}>
                <div className="team-card-top">
                  {member.photo_url ? (
                    <img
                      className="team-photo"
                      src={member.photo_url}
                      alt={`${member.name}'s profile`}
                    />
                  ) : (
                    <div className="team-photo team-placeholder">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="team-domain">
                    {member.domain}
                  </span>
                </div>

                <h3 className="team-name">{member.name}</h3>

                <p className="team-position">{member.position}</p>

                <p className="team-bio">
                  {member.bio || "An enthusiastic member of Embrione."}
                </p>

                <div className="team-meta">
                  {member.branch && <span>{member.branch}</span>}
                  {member.semester != null && (
                    <span>Semester {member.semester}</span>
                  )}
                </div>

                <div className="team-socials">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn ↗
                    </a>
                  )}

                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="team-footer">
        <p>EMBRIONE · Built by the community.</p>
      </footer>
    
      <style jsx global>{`
        .team-page {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 32px clamp(18px, 5vw, 76px) 28px !important;
          background:
            radial-gradient(ellipse at 15% 8%, rgba(177, 255, 91, 0.09), transparent 32%),
            radial-gradient(ellipse at 88% 22%, rgba(176, 137, 255, 0.12), transparent 34%),
            #080a0e !important;
          color: #f5f5f7;
        }

        .team-page::before,
        .team-page::after {
          content: "";
          position: absolute;
          pointer-events: none;
          z-index: -1;
          border-radius: 50%;
          filter: blur(70px);
          opacity: .35;
        }
        .team-page::before {
          width: 280px; height: 280px; top: 180px; left: -150px;
          background: rgba(180, 255, 91, .18);
        }
        .team-page::after {
          width: 320px; height: 320px; right: -180px; bottom: 80px;
          background: rgba(177, 137, 255, .2);
        }

        .team-header {
          position: relative;
          max-width: 1180px;
          margin: 0 auto 46px !important;
          padding: 30px 28px 32px !important;
          text-align: center;
          border: 1px solid rgba(190, 176, 255, .22);
          border-radius: 26px;
          background: linear-gradient(145deg, rgba(27, 30, 38, .96), rgba(12, 14, 20, .98));
          box-shadow: 0 5px 0 rgba(4, 5, 8, .9), 0 18px 0 rgba(119, 93, 171, .10),
            0 28px 55px rgba(0, 0, 0, .52), inset 0 1px 0 rgba(255,255,255,.08);
        }
        .team-back {
          display: inline-flex !important;
          align-items: center;
          gap: 9px;
          position: absolute !important;
          top: 20px !important;
          left: 22px !important;
          padding: 10px 15px !important;
          border: 1px solid rgba(189, 255, 91, .32) !important;
          border-radius: 12px !important;
          color: #d6ff9c !important;
          text-decoration: none !important;
          background: linear-gradient(145deg, #202a20, #111711) !important;
          box-shadow: 0 4px 0 #070a07, 0 8px 16px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.09);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .team-back:hover {
          transform: translateY(-3px);
          border-color: rgba(189, 255, 91, .75) !important;
          box-shadow: 0 7px 0 #070a07, 0 14px 22px rgba(0,0,0,.4), 0 0 22px rgba(189,255,91,.1);
        }
        .team-eyebrow {
          margin-top: 20px !important;
          color: #c5ff78 !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: .24em !important;
        }
        .team-title {
          margin: 20px 0 14px !important;
          font-size: clamp(38px, 5.5vw, 66px) !important;
          line-height: 1.04 !important;
          letter-spacing: -.045em !important;
          font-weight: 750 !important;
          text-shadow: 0 3px 0 rgba(0,0,0,.6), 0 10px 28px rgba(0,0,0,.38);
        }
        .team-title span {
          color: #c3a1ff !important;
          text-shadow: 0 3px 0 #5e477f, 0 0 28px rgba(195,161,255,.2);
        }
        .team-description {
          max-width: 620px;
          margin: 0 auto 24px !important;
          color: #b8bdca !important;
          font-size: 15px !important;
          line-height: 1.8 !important;
        }
        .team-count {
          display: inline-flex !important;
          align-items: center;
          gap: 10px;
          padding: 12px 18px !important;
          border: 1px solid rgba(195,161,255,.28);
          border-radius: 999px;
          background: linear-gradient(145deg, #25212e, #111117);
          box-shadow: 0 4px 0 #08080c, 0 10px 18px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.08);
        }
        .team-count strong { color: #c3a1ff !important; font-size: 21px !important; }
        .team-count span { color: #e1deea !important; font-size: 12px !important; }

        .team-content {
          max-width: 1360px;
          margin: 0 auto;
          padding: 28px !important;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(20,22,29,.88), rgba(9,11,15,.9));
          box-shadow: 0 5px 0 #050609, 0 17px 0 rgba(255,255,255,.018),
            0 28px 60px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.045);
        }
        .team-toolbar {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 22px !important;
          padding-bottom: 22px !important;
          margin-bottom: 24px !important;
          border-bottom: 1px solid rgba(255,255,255,.12);
        }
        .team-toolbar h2 {
          color: #f4f4f7 !important;
          font-size: 24px !important;
          letter-spacing: -.025em;
          margin: 0 0 7px !important;
        }
        .team-toolbar p { color: #aeb4c2 !important; font-size: 13px !important; margin: 0 !important; }
        .team-filters { display: flex !important; flex-wrap: wrap; gap: 12px !important; }
        .team-filters label { display: grid; gap: 7px; color: #b9beca; font-size: 12px !important; }
        .team-filters select {
          min-width: 155px;
          padding: 11px 36px 11px 13px !important;
          border: 1px solid #3a3d4b !important;
          border-radius: 11px !important;
          background: linear-gradient(145deg, #20232d, #111319) !important;
          color: #f4f4f7 !important;
          box-shadow: 0 3px 0 #08090d, 0 7px 13px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.06);
          outline: none;
        }
        .team-filters select:focus { border-color: #b99aff !important; box-shadow: 0 0 0 3px rgba(185,154,255,.15), 0 3px 0 #08090d; }

        .team-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr)) !important;
          align-items: stretch;
          gap: 22px !important;
        }
        .team-card {
          position: relative;
          min-width: 0;
          padding: 22px !important;
          border: 1px solid rgba(181, 164, 222, .24) !important;
          border-radius: 19px !important;
          background: linear-gradient(145deg, #1c1d24 0%, #121319 55%, #0c0e13 100%) !important;
          box-shadow: 0 5px 0 #050609, 0 9px 0 rgba(144,113,190,.11),
            0 18px 28px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.075) !important;
          overflow: hidden;
          overflow-wrap: anywhere;
          transform: perspective(900px) translateZ(0);
          transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease !important;
        }
        .team-card::before {
          content: "";
          position: absolute;
          top: 0; left: 18px; right: 18px;
          height: 2px;
          border-radius: 0 0 10px 10px;
          background: linear-gradient(90deg, transparent, #c3a1ff, #c5ff78, transparent);
          opacity: .8;
        }
        .team-card::after {
          content: "";
          position: absolute;
          width: 150px; height: 150px;
          right: -85px; top: -90px;
          border-radius: 50%;
          background: rgba(195,161,255,.10);
          filter: blur(18px);
          pointer-events: none;
        }
        .team-card:hover {
          transform: perspective(900px) translateY(-7px) rotateX(1.2deg) !important;
          border-color: rgba(195,161,255,.56) !important;
          box-shadow: 0 7px 0 #050609, 0 13px 0 rgba(144,113,190,.17),
            0 28px 42px rgba(0,0,0,.55), 0 0 24px rgba(195,161,255,.08),
            inset 0 1px 0 rgba(255,255,255,.1) !important;
        }
        .team-card-top { display: flex !important; align-items: center !important; justify-content: space-between; gap: 12px !important; margin-bottom: 18px !important; }
        .team-photo {
          width: 68px !important; height: 68px !important; flex: 0 0 68px;
          object-fit: cover !important;
          border-radius: 50% !important;
          border: 2px solid #c3a1ff !important;
          padding: 3px;
          background: #171a24;
          box-shadow: 0 4px 0 #07080b, 0 9px 18px rgba(0,0,0,.45), 0 0 0 4px rgba(195,161,255,.08);
        }
        .team-placeholder { display: grid !important; place-items: center; color: #d7c7ff !important; font-size: 22px !important; font-weight: 800; }
        .team-domain {
          max-width: 62%;
          padding: 7px 10px !important;
          border: 1px solid rgba(197,255,120,.25);
          border-radius: 999px !important;
          background: linear-gradient(145deg, #263021, #131a13) !important;
          color: #caff8a !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          text-align: center;
          box-shadow: 0 3px 0 #080b08, inset 0 1px 0 rgba(255,255,255,.06);
        }
        .team-name { margin: 0 0 8px !important; color: #faf9fc !important; font-size: 20px !important; line-height: 1.25 !important; letter-spacing: -.025em; overflow-wrap: anywhere; }
        .team-position { margin: 0 0 12px !important; color: #c4a8ff !important; font-size: 13px !important; line-height: 1.6 !important; }
        .team-bio { color: #b8bdc9 !important; font-size: 13px !important; line-height: 1.75 !important; margin: 0 0 18px !important; }
        .team-meta { display: flex !important; flex-wrap: wrap; gap: 8px !important; margin-top: auto; padding-top: 15px !important; border-top: 1px solid rgba(255,255,255,.1); }
        .team-meta span { padding: 6px 9px !important; border: 1px solid rgba(255,255,255,.08); border-radius: 8px; background: #20212a; color: #d7d8e0 !important; font-size: 10px !important; }
        .team-socials { display: flex !important; flex-wrap: wrap; gap: 9px !important; margin-top: 16px !important; }
        .team-socials a {
          display: inline-flex; align-items: center; padding: 8px 11px !important;
          border: 1px solid rgba(195,161,255,.25); border-radius: 9px !important;
          color: #d1baff !important; background: linear-gradient(145deg, #24202f, #121118);
          text-decoration: none !important; font-size: 11px !important;
          box-shadow: 0 3px 0 #07070a, 0 6px 10px rgba(0,0,0,.24);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .team-socials a:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #07070a, 0 9px 13px rgba(0,0,0,.32); }
        .team-message, .team-empty {
          padding: 24px !important; border: 1px solid rgba(195,161,255,.2);
          border-radius: 16px; background: linear-gradient(145deg, #1c1d25, #101116);
          box-shadow: 0 4px 0 #050609, 0 12px 24px rgba(0,0,0,.3);
          color: #d8d8e2 !important;
        }
        .team-empty h3 { color: #f4f2f8 !important; margin-top: 0; }
        .team-footer {
          max-width: 1360px; margin: 34px auto 0 !important; padding: 20px 4px 12px !important;
          display: flex !important; justify-content: space-between; align-items: center; gap: 14px;
          border-top: 1px solid rgba(255,255,255,.13);
          color: #a7adbb !important; font-size: 11px !important;
        }
        .team-footer p { margin: 0 !important; }
        @media (max-width: 680px) {
          .team-page { padding: 16px 14px 22px !important; }
          .team-header { padding: 72px 18px 24px !important; margin-bottom: 24px !important; border-radius: 20px; }
          .team-back { top: 14px !important; left: 14px !important; }
          .team-eyebrow { font-size: 10px !important; letter-spacing: .16em !important; }
          .team-content { padding: 17px !important; border-radius: 19px; }
          .team-toolbar { align-items: stretch !important; flex-direction: column; }
          .team-filters { width: 100%; }
          .team-filters label { flex: 1; min-width: 0; }
          .team-filters select { width: 100%; min-width: 0; }
          .team-grid { grid-template-columns: 1fr !important; gap: 17px !important; }
          .team-card { padding: 19px !important; }
          .team-footer { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

    </main>
  );
}
