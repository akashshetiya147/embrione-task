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
  bio: string | null;
  photo_url: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  status: "pending" | "approved" | "rejected";
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
      setSelectedIds([]);
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

  function toggleSelected(memberId: string) {
    setSelectedIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  }

  function toggleSelectAll() {
    if (members.length > 0 && selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map((member) => member.id));
    }
  }

  async function deleteSelected() {
    if (selectedIds.length === 0 || deleting) return;

    const count = selectedIds.length;
    const confirmed = window.confirm(
      `Permanently delete ${count} selected application${count === 1 ? "" : "s"}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setMessage("");

    const idsToDelete = [...selectedIds];
    const { error } = await supabase
      .from("members")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      setMessage(
        "Could not delete selected applications: " +
          error.message +
          " Check the admin DELETE policy in Supabase."
      );
      setDeleting(false);
      return;
    }

    setMembers((current) =>
      current.filter((member) => !idsToDelete.includes(member.id))
    );
    setSelectedIds([]);
    setMessage(
      `${count} selected application${count === 1 ? "" : "s"} deleted successfully.`
    );
    setDeleting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setMembers([]);
    setSelectedIds([]);
    setMessage("Logged out.");
  }

  const total = members.length;
  const pending = members.filter((m) => m.status === "pending").length;
  const approved = members.filter((m) => m.status === "approved").length;
  const allSelected = members.length > 0 && selectedIds.length === members.length;

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
            <label style={styles.label} htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            <label style={styles.label} htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button style={styles.primaryButton} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && <p style={styles.message} role="status">{message}</p>}
          <a href="/" style={styles.loginBackButton}>← Back to Home</a>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <nav style={styles.topNav}>
        <a href="/" style={styles.homeButton}>← Back to Home</a>
        <span style={styles.navBrand}>EMBRIONE <span style={styles.navDot}>•</span> ADMIN PORTAL</span>
      </nav>

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

      {message && <p style={styles.message} role="status">{message}</p>}

      <div style={styles.listHeader}>
        <div>
          <h2 style={{ marginBottom: 6 }}>All Applications</h2>
          <p style={styles.muted}>
            Select one or more applications to remove them.
          </p>
        </div>
        <div style={styles.toolbar}>
          <button style={styles.secondaryButton} onClick={loadMembers} disabled={loading || deleting}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            style={{
              ...styles.deleteButton,
              opacity: selectedIds.length === 0 || deleting ? 0.5 : 1,
              cursor: selectedIds.length === 0 || deleting ? "not-allowed" : "pointer",
            }}
            onClick={deleteSelected}
            disabled={selectedIds.length === 0 || deleting}
          >
            {deleting ? "Removing..." : `Remove selected (${selectedIds.length})`}
          </button>
        </div>
      </div>

      <label style={styles.selectAll}>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
          disabled={members.length === 0 || loading || deleting}
        />
        Select all applications
      </label>

      {loading && <p style={styles.muted}>Loading applications...</p>}

      {!loading && members.length === 0 && (
        <p style={styles.muted}>No applications found.</p>
      )}

      <section style={styles.grid}>
        {members.map((member) => (
          <article
            key={member.id}
            className="admin-3d-card"
            style={{
              ...styles.card,
              ...(selectedIds.includes(member.id) ? styles.selectedCard : {}),
            }}
          >
            <label style={styles.selectMember}>
              <input
                type="checkbox"
                checked={selectedIds.includes(member.id)}
                onChange={() => toggleSelected(member.id)}
                disabled={deleting}
                aria-label={`Select ${member.name}`}
              />
              <span>Select this application</span>
            </label>

            <div style={styles.profile}>
              {member.photo_url && (
                <img src={member.photo_url} alt={member.name} style={styles.photo} />
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
            {member.bio && <p style={styles.bio}>{member.bio}</p>}

            <div style={styles.links}>
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>
              )}
              {member.github_url && (
                <a href={member.github_url} target="_blank" rel="noreferrer">GitHub</a>
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
                  disabled={deleting}
                >
                  Approve
                </button>
                <button
                  style={styles.rejectButton}
                  onClick={() => changeStatus(member.id, "rejected")}
                  disabled={deleting}
                >
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </section>

      <style jsx global>{`
        .admin-3d-card {
          position: relative;
          isolation: isolate;
          transform: perspective(1000px) translateY(0) rotateX(0);
          transform-style: preserve-3d;
          border: 1px solid rgba(193, 163, 255, 0.28) !important;
          background:
            radial-gradient(ellipse at 12% 0%, rgba(185, 154, 255, 0.12), transparent 42%),
            linear-gradient(145deg, #1e1d26 0%, #141319 58%, #101014 100%) !important;
          box-shadow:
            0 3px 0 #34303f,
            0 7px 0 #201e28,
            0 18px 28px rgba(0, 0, 0, 0.55),
            inset 0 2px 0 rgba(255, 255, 255, 0.09),
            inset 0 -3px 0 rgba(0, 0, 0, 0.25) !important;
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }
        .admin-3d-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          border-radius: 15px 15px 0 0;
          background: linear-gradient(90deg, #b99aff, #b7f36a, #b99aff);
          opacity: 0.9;
          pointer-events: none;
        }
        .admin-3d-card:hover {
          transform: perspective(1000px) translateY(-7px) rotateX(1deg) !important;
          border-color: rgba(185, 154, 255, 0.72) !important;
          box-shadow:
            0 4px 0 #4b3b65,
            0 10px 0 #25202f,
            0 28px 42px rgba(0, 0, 0, 0.72),
            0 0 24px rgba(185, 154, 255, 0.12),
            inset 0 2px 0 rgba(255, 255, 255, 0.13) !important;
        }
        .admin-3d-card img {
          border: 2px solid rgba(185, 154, 255, 0.45);
          box-shadow: 0 5px 0 rgba(0, 0, 0, 0.35), 0 8px 18px rgba(0, 0, 0, 0.35);
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-3d-card { transition: none; }
          .admin-3d-card:hover { transform: none !important; }
        }
      `}</style>
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
    padding: "clamp(22px, 4vw, 48px) clamp(16px, 5vw, 76px)",
    boxSizing: "border-box",
    fontFamily: "var(--font-geist-sans), 'DM Sans', 'Segoe UI', sans-serif",
    fontSize: 14,
    lineHeight: 1.5,
    backgroundImage: "radial-gradient(ellipse at 12% 0%, #252033 0%, transparent 34%), radial-gradient(ellipse at 92% 10%, #14251d 0%, transparent 28%)",
  },
  loginCard: {
    maxWidth: 440,
    margin: "60px auto",
    padding: 32,
    border: "1px solid #393744",
    borderRadius: 22,
    background: "linear-gradient(145deg, #19191f, #101014)",
    boxShadow: "0 24px 55px #0008, inset 0 1px 0 #ffffff0c",
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 14,
    padding: "0 0 22px",
    marginBottom: 30,
    borderBottom: "1px solid #302b3c",
  },
  homeButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 16px",
    color: "#e8dcff",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 750,
    borderRadius: 12,
    border: "1px solid #55466f",
    background: "linear-gradient(145deg, #30283d, #1a1722)",
    boxShadow: "0 5px 0 #100d15, 0 10px 22px #0006, inset 0 1px 0 #ffffff22",
  },
  navBrand: {
    color: "#c5a7ff",
    fontSize: 12,
    fontWeight: 850,
    letterSpacing: 2.5,
  },
  navDot: { color: "#b7f36b", padding: "0 4px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  eyebrow: { color: "#c3a3ff", letterSpacing: 2.4, fontSize: 12, fontWeight: 800, textTransform: "uppercase" },
  heading: { fontSize: "clamp(30px, 3.5vw, 42px)", lineHeight: 1.12, letterSpacing: "-1.2px", fontWeight: 750, margin: "12px 0" },
  muted: { color: "#b7b5c4", lineHeight: 1.5, fontSize: 13 },
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
    padding: "13px 18px",
    border: "1px solid #d3c0ff",
    borderRadius: 11,
    background: "linear-gradient(145deg, #d0baff, #a783f4)",
    color: "#17121d",
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: ".1px",
    cursor: "pointer",
    boxShadow: "0 5px 0 #6c4eaa, 0 12px 24px #b99aff25, inset 0 1px 0 #ffffff99",
  },
  secondaryButton: {
    padding: "11px 17px",
    border: "1px solid #4b4958",
    borderRadius: 11,
    background: "linear-gradient(145deg, #292831, #1b1a21)",
    color: "#f7f4ff",
    fontSize: 14,
    fontWeight: 650,
    cursor: "pointer",
    boxShadow: "0 4px 0 #111015, 0 9px 18px #0004, inset 0 1px 0 #ffffff12",
  },
  deleteButton: {
    padding: "11px 17px",
    border: "1px solid #a14e5a",
    borderRadius: 11,
    background: "linear-gradient(145deg, #682b35, #3d1a21)",
    color: "#ffe1e4",
    fontSize: 14,
    fontWeight: 800,
    boxShadow: "0 4px 0 #1a0b0e, 0 10px 20px #0004, inset 0 1px 0 #ffffff18",
  },
  message: {
    padding: "13px 15px",
    background: "linear-gradient(145deg, #202026, #17171c)",
    border: "1px solid #34333d",
    borderRadius: 11,
    overflowWrap: "anywhere",
    fontSize: 14,
  },
  loginBackButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    marginTop: 24,
    padding: "10px 15px",
    border: "1px solid rgba(189, 255, 91, .32)",
    borderRadius: 12,
    color: "#d6ff9c",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 750,
    background: "linear-gradient(145deg, #202a20, #111711)",
    boxShadow: "0 4px 0 #070a07, 0 8px 16px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.09)",
  },
  link: { display: "inline-block", marginTop: 24, color: "#c3a3ff" },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    margin: "30px 0",
  },
  statCard: {
    padding: 22,
    border: "1px solid #393744",
    borderRadius: 16,
    background: "linear-gradient(145deg, #19191f, #111115)",
    boxShadow: "0 9px 0 #07070a, 0 20px 34px #0008, inset 0 2px 0 #ffffff12, inset 0 -1px 0 #0008",
  },
  statValue: { fontSize: 34, lineHeight: 1.15, fontWeight: 750, letterSpacing: "-1px", margin: 0, color: "#f7f3ff" },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  toolbar: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 },
  selectAll: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    marginTop: 20,
    color: "#d5d5df",
    fontSize: 14,
    cursor: "pointer",
  },
  selectMember: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
    color: "#bcbcc8",
    fontSize: 13,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
    gap: 16,
    marginTop: 18,
  },
  card: {
    padding: 18,
    border: "1px solid #393744",
    borderRadius: 15,
    background: "linear-gradient(145deg, #19191f, #111115)",
    boxShadow: "0 7px 0 #07070a, 0 18px 28px #0008, inset 0 2px 0 #ffffff12, inset 0 -1px 0 #0008",
    overflowWrap: "anywhere",
    minWidth: 0,
    fontSize: 14,
    lineHeight: 1.5,
    transition: "border-color .2s, box-shadow .2s",
  },
  selectedCard: {
    border: "1px solid #b99aff",
    boxShadow: "0 7px 0 #07070a, 0 0 0 2px #b99aff35, 0 20px 32px #0009, inset 0 2px 0 #ffffff18",
  },
  profile: { display: "flex", gap: 12, alignItems: "center", minWidth: 0, marginBottom: 10 },
  photo: {
    width: 56,
    height: 56,
    flex: "0 0 56px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  name: { margin: "0 0 5px", fontSize: 18, lineHeight: 1.25, fontWeight: 700, letterSpacing: "-.2px", color: "#fbfaff", overflowWrap: "anywhere" },
  bio: { color: "#d0d0d8", lineHeight: 1.6 },
  links: { display: "flex", gap: 16, flexWrap: "wrap" },
  actions: { display: "flex", gap: 10, marginTop: 16 },
  approveButton: {
    flex: 1,
    padding: "12px 14px",
    background: "linear-gradient(145deg, #d0baff, #a783f4)",
    color: "#17121d",
    border: "1px solid #d3c0ff",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 800,
    boxShadow: "0 4px 0 #6c4eaa, inset 0 1px 0 #ffffff99",
    cursor: "pointer",
  },
  rejectButton: {
    flex: 1,
    padding: "12px 14px",
    background: "linear-gradient(145deg, #48242b, #2c171c)",
    color: "#ffccd2",
    border: "1px solid #70404a",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 800,
    boxShadow: "0 4px 0 #180b0e, inset 0 1px 0 #ffffff10",
    cursor: "pointer",
  },
};
