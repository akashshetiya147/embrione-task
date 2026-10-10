
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
        <a href="/" className="team-back">
          ← Home
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
        <a href="/">Back to Home ↑</a>
      </footer>
    </main>
  );
}
