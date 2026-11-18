import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import { getProfileImageUrl } from "../hooks/usePortfolioData";

import "./AdminProfile.css";

const BUCKET = "portfolio-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function AdminProfile() {
  const [profile, setProfile] = useState({
    full_name: "",
    professional_title: "",
    introduction: "",
    image_path: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // LOAD EXISTING PROFILE
  // =====================================

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data, error: fetchError } = await supabase
          .from("portfolio_profile")
          .select(
            "full_name, professional_title, introduction, image_path"
          )
          .eq("id", 1)
          .single();

        if (fetchError) throw fetchError;

        if (active) {
          setProfile({
            full_name: data.full_name || "",
            professional_title: data.professional_title || "",
            introduction: data.introduction || "",
            image_path: data.image_path || null,
          });
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // =====================================
  // IMAGE PREVIEW
  // =====================================

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  // =====================================
  // INPUT CHANGES
  // =====================================

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // =====================================
  // SELECT IMAGE
  // =====================================

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      setSelectedImage(null);
      return;
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be between 1 byte and 5 MB.");
      event.target.value = "";
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);
  }

  // =====================================
  // SAVE PROFILE
  // =====================================

  async function handleSave(event) {
    event.preventDefault();

    const fullName = profile.full_name.trim();
    const title = profile.professional_title.trim();
    const introduction = profile.introduction.trim();

    if (!fullName || !title || !introduction) {
      setError("Please complete all required fields.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    let uploadedPath = null;
    let databaseSaved = false;
    const previousImagePath = profile.image_path;

    try {
      // Upload a new picture, if selected
      if (selectedImage) {
        const extension = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        }[selectedImage.type];

        uploadedPath = `profile/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(uploadedPath, selectedImage, {
            contentType: selectedImage.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;
      }

      // Save profile in database
      const { data, error: updateError } = await supabase
        .from("portfolio_profile")
        .update({
          full_name: fullName,
          professional_title: title,
          introduction,
          image_path: uploadedPath || previousImagePath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)
        .select(
          "full_name, professional_title, introduction, image_path"
        )
        .single();

      if (updateError) throw updateError;

      databaseSaved = true;

      setProfile(data);
      setSelectedImage(null);

      const input = document.getElementById("profile-image-input");
      if (input) input.value = "";

      setSuccess("Profile updated successfully!");

      // Remove previous image after successful save
      if (
        uploadedPath &&
        previousImagePath &&
        uploadedPath !== previousImagePath
      ) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove([previousImagePath]);

        if (cleanupError) {
          console.warn("Old image cleanup failed:", cleanupError);

          setSuccess(
            "Profile updated. Previous image cleanup failed."
          );
        }
      }
    } catch (err) {
      // Remove unused upload if database save failed
      if (uploadedPath && !databaseSaved) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.warn("Unused image cleanup failed:", cleanupError);
        }
      }

      setError(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">

      <div className="admin-profile-heading">
        <h2>👤 Edit Profile</h2>

        <p>
          Update your information and profile picture.
        </p>
      </div>

      <form
        className="admin-profile-form"
        onSubmit={handleSave}
      >

        {/* PROFILE PICTURE */}
        <div className="admin-profile-field">

          <label htmlFor="profile-image-input">
            Profile Picture
          </label>

          <img
            src={
              previewUrl ||
              getProfileImageUrl(profile.image_path)
            }
            alt="Profile preview"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #C79A4B",
            }}
            onError={(event) => {
              const image = event.currentTarget;

              if (!image.src.endsWith("/images/profile.png")) {
                image.src = "/images/profile.png";
              }
            }}
          />

          <input
            id="profile-image-input"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={saving}
          />

          <small>
            JPG, PNG, or WebP. Maximum size: 5 MB.
          </small>

        </div>

        {/* FULL NAME */}
        <div className="admin-profile-field">

          <label htmlFor="profile-name">
            Full Name
          </label>

          <input
            id="profile-name"
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            maxLength={120}
            required
          />

        </div>

        {/* PROFESSIONAL TITLE */}
        <div className="admin-profile-field">

          <label htmlFor="profile-title">
            Professional Title
          </label>

          <input
            id="profile-title"
            type="text"
            name="professional_title"
            value={profile.professional_title}
            onChange={handleChange}
            maxLength={160}
            required
          />

        </div>

        {/* INTRODUCTION */}
        <div className="admin-profile-field">

          <label htmlFor="profile-introduction">
            Introduction
          </label>

          <textarea
            id="profile-introduction"
            name="introduction"
            value={profile.introduction}
            onChange={handleChange}
            rows={6}
            maxLength={3000}
            required
          />

        </div>

        {/* ERROR */}
        {error && (
          <div className="admin-profile-error" role="alert">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="admin-profile-success" role="status">
            {success}
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="admin-profile-save"
          disabled={saving}
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>

      </form>

    </div>
  );
}

export default AdminProfile;