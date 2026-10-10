
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 800;

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

function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
        const scale = Math.min(
          1,
          MAX_IMAGE_WIDTH / image.naturalWidth
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Could not process the selected image."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.type !== "image/webp") {
              reject(
                new Error("WebP conversion failed. Try another image.")
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

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
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

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;
    setMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setSelectedFile(null);
      event.target.value = "";
      setMessageType("error");
      setMessage("Choose a PNG, JPG, JPEG or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedFile(null);
      event.target.value = "";
      setMessageType("error");
      setMessage("Your image must be smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
  }

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    setMessage("");

    if (!selectedFile) {
      setMessageType("error");
      setMessage("Please select a profile picture.");
      return;
    }

    const srn = form.srn.trim().toUpperCase();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !srn || !email) {
      setMessageType("error");
      setMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    let uploadedPath: string | null = null;

    try {
      // Check for an existing SRN when it is visible to this client.
      // The database unique constraint also prevents duplicate inserts
      // when Row Level Security hides pending records.
      const { data: existing, error: lookupError } = await supabase
        .from("members")
        .select("id")
        .ilike("srn", srn)
        .limit(1);

      if (lookupError) {
        throw new Error(
          "Could not check existing applications. Verify your Supabase setup and policies."
        );
      }

      if (existing && existing.length > 0) {
        setMessageType("error");
        setMessage("This SRN has already been submitted.");
        return;
      }

      setMessageType("info");
      setMessage("Converting your photo to WebP...");

      const webpBlob = await convertToWebP(selectedFile);
      const filePath = `${crypto.randomUUID()}.webp`;

      setMessage("Uploading your WebP photo...");

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

      const { error: insertError } = await supabase
        .from("members")
        .insert({
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
          setMessage("This SRN has already been submitted.");
          return;
        }

        throw new Error(`Could not save application: ${insertError.message}`);
      }

      setMessageType("success");
      setMessage(
        "Application submitted successfully! Your profile is pending admin approval."
      );

      setForm({
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

      setSelectedFile(null);

      const input = document.getElementById(
        "profile-picture"
      ) as HTMLInputElement | null;

      if (input) input.value = "";
    } catch (error) {
      // Avoid leaving an orphaned photo when the database insert fails.
      if (uploadedPath) {
        await supabase.storage
          .from("member-photos")
          .remove([uploadedPath]);
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
          Tell us about yourself. Your member card updates automatically
          as you fill in your details.
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
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Position *
              <select name="position" value={form.position} onChange={update}>
                {positions.map((item) => (
                  <option key={item} value={item}>{item}</option>
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
                  <option key={item} value={item}>{item}</option>
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
            Profile picture *
            <input
              id="profile-picture"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              required
            />
            <span className="character-count">
              PNG, JPG or WebP · Max 10 MB · Converted to WebP on submit
            </span>
          </label>

          <button
            className="submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit application"}
            <span>{submitting ? "…" : "→"}</span>
          </button>

          {message && (
            <p
              className="form-message"
              role="status"
              aria-live="polite"
              style={{
                color:
                  messageType === "error"
                    ? "#ff8e8e"
                    : messageType === "success"
                      ? "#b6f36b"
                      : "#c5cad4",
              }}
            >
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
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Profile preview" />
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
            Your application will appear in the team directory only after
            an administrator approves it.
          </p>
        </aside>
      </div>
    </main>
  );
}
