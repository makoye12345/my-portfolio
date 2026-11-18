import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AdminAppearance.css";

const defaultAppearance = {
  primary_color: "#355F5C",
  accent_color: "#C79A4B",
  background_color: "#F6F1E8",
  surface_color: "#FFFBF3",
  text_color: "#3A2718",
  default_theme: "dark",
};

const colorFields = [
  { key: "primary_color", label: "Primary Color" },
  { key: "accent_color", label: "Accent Color" },
  { key: "background_color", label: "Background Color" },
  { key: "surface_color", label: "Surface Color" },
  { key: "text_color", label: "Text Color" },
];

function AdminAppearance() {
  const [form, setForm] = useState({ ...defaultAppearance });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // LOAD APPEARANCE SETTINGS
  // =====================================

  useEffect(() => {
    let active = true;

    async function loadAppearance() {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from("portfolio_appearance")
          .select(
            "primary_color, accent_color, background_color, surface_color, text_color, default_theme"
          )
          .eq("id", 1)
          .single();

        if (fetchError) throw fetchError;

        if (active) {
          setForm({
            primary_color: data.primary_color,
            accent_color: data.accent_color,
            background_color: data.background_color,
            surface_color: data.surface_color,
            text_color: data.text_color,
            default_theme: data.default_theme,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Unable to load appearance settings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAppearance();

    return () => {
      active = false;
    };
  }, []);

  // =====================================
  // HANDLE CHANGES
  // =====================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // =====================================
  // RESET PREVIEW TO DEFAULTS
  // =====================================

  function resetToDefaults() {
    setForm({ ...defaultAppearance });

    setError("");
    setSuccess(
      "Default colors restored in preview. Click Save Changes to publish."
    );
  }

  // =====================================
  // SAVE APPEARANCE
  // =====================================

  async function handleSave(event) {
    event.preventDefault();

    const validColor = /^#[0-9A-Fa-f]{6}$/;

    const colorsAreValid = colorFields.every((field) =>
      validColor.test(form[field.key])
    );

    if (!colorsAreValid) {
      setError("All colors must use the #RRGGBB format.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: updateError } = await supabase
        .from("portfolio_appearance")
        .update({
          ...form,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)
        .select("id")
        .single();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error("Appearance settings could not be saved.");
      }

      setSuccess("Appearance settings saved successfully!");
    } catch (err) {
      setError(
        err.message || "Unable to save appearance settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-appearance-container">
        <p>Loading appearance settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-appearance-container">
      <div className="admin-appearance-heading">
        <h2>🎨 Appearance Management</h2>

        <p>
          Customize your portfolio colors and default theme.
        </p>
      </div>

      <div className="admin-appearance-layout">
        {/* SETTINGS FORM */}
        <form
          className="admin-appearance-form"
          onSubmit={handleSave}
        >
          <h3>Portfolio Colors</h3>

          {colorFields.map((field) => (
            <div
              className="admin-appearance-field"
              key={field.key}
            >
              <label htmlFor={field.key}>
                {field.label}
              </label>

              <div className="admin-appearance-color-row">
                <input
                  id={field.key}
                  type="color"
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                  maxLength={7}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  aria-label={`${field.label} hexadecimal value`}
                />
              </div>
            </div>
          ))}

          <div className="admin-appearance-field">
            <label htmlFor="default-theme">
              Default Theme
            </label>

            <select
              id="default-theme"
              name="default_theme"
              value={form.default_theme}
              onChange={handleChange}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          {error && (
            <div
              className="admin-appearance-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="admin-appearance-success"
              role="status"
            >
              {success}
            </div>
          )}

          <div className="admin-appearance-actions">
            <button
              type="submit"
              className="admin-appearance-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="admin-appearance-reset"
              onClick={resetToDefaults}
              disabled={saving}
            >
              Reset Colors
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW */}
        <div className="admin-appearance-preview-panel">
          <h3>Live Preview</h3>

          <p>
            Changes shown here are not published until you save.
          </p>

          <div
            className="admin-appearance-preview"
            style={{
              backgroundColor: form.background_color,
              color: form.text_color,
            }}
          >
            <div
              className="admin-appearance-preview-header"
              style={{
                backgroundColor: form.primary_color,
              }}
            >
              <strong>My Portfolio</strong>
              <span>Home · About · Projects</span>
            </div>

            <div
              className="admin-appearance-preview-card"
              style={{
                backgroundColor: form.surface_color,
              }}
            >
              <h4 style={{ color: form.primary_color }}>
                Hello, I'm a Developer
              </h4>

              <p>
                I build modern web and mobile applications.
              </p>

              <button
                type="button"
                style={{
                  backgroundColor: form.accent_color,
                  color: form.text_color,
                }}
              >
                View Projects
              </button>
            </div>
          </div>

          <div className="admin-appearance-preview-note">
            <strong>Selected Theme:</strong>{" "}
            {form.default_theme === "dark"
              ? "Dark Mode"
              : "Light Mode"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAppearance;