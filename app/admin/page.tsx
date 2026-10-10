
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
  branch: string;
  semester: number;
  bio: string;
  photo_url: string;
  linkedin_url?: string;
  github_url?: string;
  status: "pending" | "approved" | "rejected";
};

export default function AdminPage() {
  const [email, setEmail] = useState("admin@embrione.pes.edu");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadMembers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load applications: " + error.message);
    } else {
      setMembers((data ?? []) as Member[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (active && data.session) {
        const { data: admin, error } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", data.session.user.id)
          .maybeSingle();

        if (active && admin && !error) {
          setLoggedIn(true);
          await loadMembers();
        } else if (active) {
          await supabase.auth.signOut();
        }
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setMessage("Login failed. Check your email and password.");
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setMessage("This account is not authorized as an admin.");
      setLoading(false);
      return;
    }

    setPassword("");
    setLoggedIn(true);
    await loadMembers();
    setLoading(false);
  }

  async function changeStatus(
    memberId: string,
    status: "approved" | "rejected"
  ) {
    const previous = members;

    setMembers((current) =>
      current.map((member) =>
        member.id === memberId ? { ...member, status } : member
      )
    );

    const { error } = await supabase
      .from("members")
      .update({ status })
      .eq("id", memberId);

    if (error) {
      setMembers(previous);
      setMessage("Status update failed: " + error.message);
      return;
    }

    setMessage(`Application ${status} successfully.`);
    await loadMembers();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setMembers([]);
    setMessage("Logged out.");
  }

  const total = members.length;
  const pending = members.filter((m) => m.status === "pending").length;
  const approved = members.filter((m) => m.status === "approved").length;

  if (!loggedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <p style={styles.eyebrow}>EMBRIONE · ADMIN PORTAL</p>
          <h1 style={styles.heading}>Admin Login</h1>
          <p style={styles.muted}>
            Sign in with your authorized Supabase admin account.
          </p>

          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button style={styles.primaryButton} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && <p style={styles.message}>{message}</p>}
          <a href="/" style={styles.link}>← Back to Home</a>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>EMBRIONE · ADMIN PORTAL</p>
          <h1 style={styles.heading}>Applications</h1>
          <p style={styles.muted}>Review and manage recruitment submissions.</p>
        </div>
        <button style={styles.secondaryButton} onClick={handleLogout}>
          Sign Out
        </button>
      </header>

      <section style={styles.stats}>
        <Stat title="Total Submissions" value={total} />
        <Stat title="Pending" value={pending} />
        <Stat title="Approved" value={approved} />
      </section>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.listHeader}>
        <h2>All Applications</h2>
        <button style={styles.secondaryButton} onClick={loadMembers}>
          Refresh
        </button>
      </div>

      {loading && <p style={styles.muted}>Loading applications...</p>}

      {!loading && members.length === 0 && (
        <p style={styles.muted}>No applications found.</p>
      )}

      <section style={styles.grid}>
        {members.map((member) => (
          <article key={member.id} style={styles.card}>
            <div style={styles.profile}>
              {member.photo_url && (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  style={styles.photo}
                />
              )}
              <div>
                <h3 style={styles.name}>{member.name}</h3>
                <p style={styles.muted}>{member.position} · {member.domain}</p>
                <p style={styles.muted}>{member.srn}</p>
              </div>
            </div>

            <p><strong>Email:</strong> {member.email}</p>
            <p><strong>Branch:</strong> {member.branch}</p>
            <p><strong>Semester:</strong> {member.semester}</p>
            <p style={styles.bio}>{member.bio}</p>

            <div style={styles.links}>
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
              {member.github_url && (
                <a href={member.github_url} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
            </div>

            <p>
              Status: <strong>{member.status.toUpperCase()}</strong>
            </p>

            {member.status === "pending" && (
              <div style={styles.actions}>
                <button
                  style={styles.approveButton}
                  onClick={() => changeStatus(member.id, "approved")}
                >
                  Approve
                </button>
                <button
                  style={styles.rejectButton}
                  onClick={() => changeStatus(member.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </section>

      <a href="/" style={styles.link}>← Back to Home</a>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <article style={styles.statCard}>
      <p style={styles.muted}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0d",
    color: "#f5f5f5",
    padding: "40px 6%",
    fontFamily: "Arial, sans-serif",
  },
  loginCard: {
    maxWidth: 440,
    margin: "60px auto",
    padding: 32,
    border: "1px solid #303036",
    borderRadius: 16,
    background: "#141418",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  eyebrow: { color: "#c3a3ff", letterSpacing: 2, fontSize: 12 },
  heading: { fontSize: 34, margin: "12px 0" },
  muted: { color: "#aaaab5", lineHeight: 1.6 },
  form: { display: "grid", gap: 12, marginTop: 24 },
  label: { fontSize: 14, color: "#ddd" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    background: "#202026",
    color: "#fff",
    border: "1px solid #41414a",
    borderRadius: 8,
  },
  primaryButton: {
    padding: 13,
    border: 0,
    borderRadius: 8,
    background: "#b99aff",
    color: "#15121b",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 16px",
    border: "1px solid #454550",
    borderRadius: 8,
    background: "#202026",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    padding: 12,
    background: "#202026",
    borderRadius: 8,
    overflowWrap: "anywhere",
  },
  link: { display: "inline-block", marginTop: 24, color: "#c3a3ff" },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    margin: "30px 0",
  },
  statCard: {
    padding: 20,
    border: "1px solid #303036",
    borderRadius: 12,
    background: "#141418",
  },
  statValue: { fontSize: 30, margin: 0 },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
    marginTop: 20,
  },
  card: {
    padding: 20,
    border: "1px solid #303036",
    borderRadius: 12,
    background: "#141418",
    overflowWrap: "anywhere",
  },
  profile: { display: "flex", gap: 14, alignItems: "center" },
  photo: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    objectFit: "cover",
  },
  name: { margin: "0 0 6px", fontSize: 20 },
  bio: { color: "#d0d0d8", lineHeight: 1.6 },
  links: { display: "flex", gap: 16 },
  actions: { display: "flex", gap: 10, marginTop: 16 },
  approveButton: {
    flex: 1,
    padding: 11,
    background: "#b99aff",
    color: "#17121d",
    border: 0,
    borderRadius: 8,
    cursor: "pointer",
  },
  rejectButton: {
    flex: 1,
    padding: 11,
    background: "#392126",
    color: "#ffb8c0",
    border: "1px solid #70404a",
    borderRadius: 8,
    cursor: "pointer",
  },
};
