
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const DOMAINS = [
  "Web Development",
  "Design",
  "Logistics",
  "Operations",
  "Sponsorship",
  "Hospitality",
  "Social Media",
  "Event Management",
];

const POSITIONS = ["Head", "Vice-Head", "Core Member", "Member"];
const BRANCHES = ["CSE", "AIML", "ECE", "EEE", "ME", "Biotech", "Other"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

type FormData = {
  name: string;
  domain: string;
  position: string;
  srn: string;
  email: string;
  linkedin: string;
  github: string;
  branch: string;
  semester: string;
  bio: string;
};

const EMPTY_FORM: FormData = {
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
};

function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
        const scale = Math.min(1, 800 / image.naturalWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Your browser could not process this image."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.type !== "image/webp") {
              reject(
                new Error("WebP conversion failed. Please choose another image.")
              );
              return;
            }

            resolve(blob);
          },
          "image/webp",
          0.8
        );
      } catch {
        reject(new Error("Could not convert the selected image."));
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("The selected image could not be opened."));
    };

    image.src = objectUrl;
  });
}

function validOptionalUrl(value: string): boolean {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPhotoPreview("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function update(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      event.target.value = "";
      setSelectedFile(null);
      setMessageType("error");
      setMessage("Please select a PNG, JPG, JPEG, or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      event.target.value = "";
      setSelectedFile(null);
      setMessageType("error");
      setMessage("Your profile photo must be 10 MB or smaller.");
      return;
    }

    setSelectedFile(file);
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setMessage("");

    if (!selectedFile) {
      setMessageType("error");
      setMessage("Please select a profile picture.");
      return;
    }

    if (
      !validOptionalUrl(form.linkedin) ||
      !validOptionalUrl(form.github)
    ) {
      setMessageType("error");
      setMessage("Please enter valid LinkedIn and GitHub URLs.");
      return;
    }

    const name = form.name.trim();
    const srn = form.srn.trim().toUpperCase();
    const email = form.email.trim();

    if (!name || !srn || !email) {
      setMessageType("error");
      setMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    let uploadedPath: string | null = null;

    try {
      setMessageType("info");
      setMessage("Checking your application details...");

      const { data: existing, error: lookupError } = await supabase
        .from("members")
        .select("id")
        .ilike("srn", srn)
        .limit(1);

      if (lookupError) {
        throw new Error(
          "Could not check existing applications. Please verify your Supabase policies and try again."
        );
      }

      if (existing && existing.length > 0) {
        setMessageType("error");
        setMessage("An application with this SRN already exists.");
        return;
      }

      setMessage("Converting your photo to WebP...");
      const webpBlob = await convertToWebP(selectedFile);
      const filePath = `${crypto.randomUUID()}.webp`;

      setMessage("Uploading your profile photo...");

      const { error: uploadError } = await supabase.storage
        .from("member-photos")
        .upload(filePath, webpBlob, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Photo upload failed: ${uploadError.message}`);
      }

      uploadedPath = filePath;

      const { data: publicUrlData } = supabase.storage
        .from("member-photos")
        .getPublicUrl(filePath);

      setMessage("Saving your application...");

      const { error: insertError } = await supabase.from("members").insert({
        name,
        domain: form.domain,
        position: form.position,
        srn,
        email,
        linkedin_url: form.linkedin.trim() || null,
        github_url: form.github.trim() || null,
        branch: form.branch,
        semester: Number(form.semester),
        bio: form.bio.trim() || null,
        photo_url: publicUrlData.publicUrl,
        status: "pending",
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setMessageType("error");
          setMessage("An application with this SRN already exists.");
          return;
        }

        throw new Error(`Could not save your application: ${insertError.message}`);
      }

      uploadedPath = null;
      setForm(EMPTY_FORM);
      setSelectedFile(null);

      const input = document.getElementById(
        "profile-picture"
      ) as HTMLInputElement | null;

      if (input) input.value = "";

      setMessageType("success");
      setMessage(
        "Application submitted successfully! Your application is now pending admin review."
      );
    } catch (error) {
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from("member-photos")
          .remove([uploadedPath]);

        if (cleanupError) {
          console.error("Could not remove the unused uploaded photo:", cleanupError);
        }
      }

      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="register-shell register-modern">
      <nav className="register-nav" aria-label="Main navigation">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>EMBRIONE</span>
        </Link>

        <Link href="/" className="register-home-button">
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>
      </nav>

      <header className="register-heading register-hero">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>
          Make your <span>mark.</span>
        </h1>
        <p>
          Bring your ideas, curiosity, and energy to Embrione. Tell us about
          yourself and preview your member card as you go.
        </p>

        <div className="register-hero-tags">
          <span>✦ Build together</span>
          <span>✦ Create impact</span>
          <span>✦ Find your people</span>
        </div>
      </header>

      <div className="register-layout register-modern-layout">
        <form
          className="register-form register-modern-form"
          onSubmit={submitForm}
        >
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
              autoComplete="name"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Domain *
              <select name="domain" value={form.domain} onChange={update}>
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </label>

            <label>
              Position *
              <select name="position" value={form.position} onChange={update}>
                {POSITIONS.map((position) => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Student Registration Number (SRN) *
            <input
              name="srn"
              value={form.srn}
              onChange={update}
              placeholder="e.g. PES1UG25CS001"
              autoCapitalize="characters"
              required
            />
          </label>

          <label>
            Email address *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              autoComplete="email"
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
                {BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </label>

            <label>
              Semester *
              <select name="semester" value={form.semester} onChange={update}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                  <option key={semester} value={String(semester)}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            LinkedIn profile
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={update}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </label>

          <label>
            GitHub profile
            <input
              type="url"
              name="github"
              value={form.github}
              onChange={update}
              placeholder="https://github.com/your-username"
            />
          </label>

          <label>
            Introduce yourself
            <textarea
              name="bio"
              value={form.bio}
              onChange={update}
              placeholder="What do you enjoy creating or learning?"
              maxLength={200}
              rows={4}
            />
            <span className="character-count">
              {form.bio.length}/200 characters
            </span>
          </label>

          <div className="upload-section">
            <p className="upload-title">03 · Profile picture</p>

            <label className="upload-dropzone" htmlFor="profile-picture">
              <span className="upload-icon" aria-hidden="true">↑</span>

              <strong>
                {selectedFile ? "Photo selected" : "Upload your profile photo"}
              </strong>

              <span className="upload-filename">
                {selectedFile
                  ? selectedFile.name
                  : "Click here to choose a PNG, JPG or WebP image"}
              </span>

              <small>Maximum 10 MB · Automatically converted to WebP</small>

              <input
                id="profile-picture"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                required={!selectedFile}
              />
            </label>
          </div>

          <button
            className="submit-button register-modern-submit"
            type="submit"
            disabled={submitting}
          >
            <span>
              {submitting ? "Submitting application..." : "Submit my application"}
            </span>
            <span aria-hidden="true">{submitting ? "…" : "→"}</span>
          </button>

          {message && (
            <p
              className={`form-message register-status ${messageType}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <p className="privacy-note">
            Your application stays pending until the Embrione admin team reviews it.
          </p>
        </form>

        <aside className="preview-panel register-modern-preview">
          <p className="eyebrow">LIVE PREVIEW</p>
          <p className="preview-intro">
            This is how your profile card will look.
          </p>

          <div className="member-card register-preview-card">
            <div className="member-card-top">
              <span className="mini-brand">EMBRIONE</span>
              <span className="member-badge">FUTURE MEMBER</span>
            </div>

            <div className="avatar">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Your profile preview" />
              ) : (
                <span>
                  {form.name.trim().charAt(0).toUpperCase() || "✦"}
                </span>
              )}
            </div>

            <p className="card-domain">{form.domain}</p>
            <h2>{form.name || "Your Name"}</h2>
            <p className="card-position">{form.position}</p>
            <p className="card-bio">
              {form.bio || "Your story starts here. Add a short bio to introduce yourself."}
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
              <span>EMBRIONE COMMUNITY</span>
              <span>PES UNIVERSITY</span>
            </div>
          </div>

          <div className="preview-tip">
            <span aria-hidden="true">✦</span>
            <p>
              <strong>Make it yours.</strong>
              <br />
              A clear photo and a genuine introduction help the team get to know you.
            </p>
          </div>
        </aside>
      </div>

      <footer className="register-footer register-footer-3d">
        <span>EMBRIONE · MADE BY THE COMMUNITY</span>

        <Link href="/" className="return-home-3d">
          <span aria-hidden="true">←</span>
          <span>Return to Home</span>
          <span aria-hidden="true">↑</span>
        </Link>
      </footer>
    </main>
  );
}
