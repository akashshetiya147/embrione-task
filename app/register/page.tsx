
"use client";

import { useState } from "react";
import Link from "next/link";

const domains = [
  "Web Development",
  "Design",
  "Logistics",
  "Operations",
  "Sponsorship",
  "Hospitality",
  "Social Media",
  "Event Management",
];

const positions = ["Head", "Vice-Head", "Core Member", "Member"];

const branches = [
  "CSE",
  "AIML",
  "ECE",
  "EEE",
  "ME",
  "Biotech",
  "Other",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    domain: "Web Development",
    position: "Member",
    srn: "",
    email: "",
    linkedin: "",
    github: "",
    branch: "CSE",
    semester: "1",
    bio: "",
  });

  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");

  function update(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function previewPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setMessage("Please select a PNG, JPG, JPEG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(String(reader.result));
      setMessage("");
    };

    reader.onerror = () => {
      setMessage("Unable to preview this image. Please try another.");
    };

    reader.readAsDataURL(file);
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.bio.length > 200) {
      setMessage("Your bio must be 200 characters or fewer.");
      return;
    }

    setMessage(
      "Your preview is ready! Supabase submission will be enabled in the next step."
    );
  }

  return (
    <main className="register-shell">
      <nav className="register-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          EMBRIONE
        </Link>

        <Link href="/" className="back-link">
          ← Home
        </Link>
      </nav>

      <header className="register-heading">
        <p className="eyebrow">BECOME PART OF THE COMMUNITY</p>
        <h1>Make your mark.</h1>
        <p>
          Tell us about yourself. Your member card updates
          automatically as you fill in your details.
        </p>
      </header>

      <div className="register-layout">
        <form className="register-form" onSubmit={submitForm}>
          <div className="form-section-title">
            <span>01</span>
            <h2>Personal information</h2>
          </div>

          <label>
            Full name *
            <input
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Enter your full name"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Domain *
              <select name="domain" value={form.domain} onChange={update}>
                {domains.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Position *
              <select
                name="position"
                value={form.position}
                onChange={update}
              >
                {positions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            SRN *
            <input
              name="srn"
              value={form.srn}
              onChange={update}
              placeholder="PES1UG25CS001"
              required
            />
          </label>

          <label>
            Email *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              required
            />
          </label>

          <div className="form-section-title second-title">
            <span>02</span>
            <h2>Academic & social profiles</h2>
          </div>

          <div className="form-row">
            <label>
              Branch *
              <select name="branch" value={form.branch} onChange={update}>
                {branches.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Semester *
              <select
                name="semester"
                value={form.semester}
                onChange={update}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <option key={item} value={String(item)}>
                    Semester {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            LinkedIn URL
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={update}
              placeholder="https://linkedin.com/in/..."
            />
          </label>

          <label>
            GitHub URL
            <input
              type="url"
              name="github"
              value={form.github}
              onChange={update}
              placeholder="https://github.com/..."
            />
          </label>

          <label>
            Short bio
            <textarea
              name="bio"
              value={form.bio}
              onChange={update}
              placeholder="Tell us what you enjoy building..."
              maxLength={200}
              rows={4}
            />
            <span className="character-count">
              {form.bio.length}/200 characters
            </span>
          </label>

          <label>
            Profile picture
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={previewPhoto}
            />
          </label>

          <button className="submit-button" type="submit">
            Preview application <span>→</span>
          </button>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
        </form>

        <aside className="preview-panel">
          <p className="eyebrow">LIVE PREVIEW</p>

          <div className="member-card">
            <div className="member-card-top">
              <span className="mini-brand">E.</span>
              <span className="member-badge">MEMBER PROFILE</span>
            </div>

            <div className="avatar">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Profile preview" />
              ) : (
                <span>
                  {form.name.trim().charAt(0).toUpperCase() || "E"}
                </span>
              )}
            </div>

            <p className="card-domain">{form.domain}</p>
            <h2>{form.name || "Your Name"}</h2>
            <p className="card-position">{form.position}</p>

            <p className="card-bio">
              {form.bio || "Your introduction will appear here."}
            </p>

            <div className="member-details">
              <div>
                <span>BRANCH</span>
                <strong>{form.branch}</strong>
              </div>

              <div>
                <span>SEMESTER</span>
                <strong>{form.semester}</strong>
              </div>
            </div>

            <div className="member-card-footer">
              <span>THE EMBRIONE</span>
              <span>PES UNIVERSITY</span>
            </div>
          </div>

          <p className="preview-note">
            Local preview only. Your profile has not been saved yet.
          </p>
        </aside>
      </div>
    </main>
  );
}
