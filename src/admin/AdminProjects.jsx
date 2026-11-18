import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AdminProjects.css";

const BUCKET = "portfolio-projects";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  github_url: "",
  demo_url: "",
  status: "Completed",
  sort_order: 0,
};

function validateUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [existingImagePath, setExistingImagePath] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProjects() {
    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("portfolio_projects")
        .select(
          "id, title, description, technologies, github_url, demo_url, image_path, status, sort_order"
        )
        .order("sort_order", { ascending: true })
        .order("id", { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setExistingImagePath(null);
    setSelectedImage(null);

    const input = document.getElementById("project-image-input");
    if (input) input.value = "";
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedImage(null);
      return;
    }

    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!acceptedTypes.includes(file.type)) {
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

  function getImageUrl(path) {
    if (!path) return "";

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function uploadImage(file) {
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[file.type];

    if (!extension) {
      throw new Error("Unsupported image type.");
    }

    const path = `projects/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    return path;
  }

  async function removeImage(path) {
    if (!path) return;

    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (removeError) throw removeError;
  }

  async function handleSave(event) {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) {
      setError("Project title and description are required.");
      return;
    }

    if (!validateUrl(form.github_url) || !validateUrl(form.demo_url)) {
      setError("Enter valid HTTP or HTTPS links.");
      return;
    }

    const sortOrder = Number(form.sort_order);

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError("Display order must be a non-negative whole number.");
      return;
    }

    const technologies = [
      ...new Set(
        form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ];

    setSaving(true);
    setError("");
    setSuccess("");

    let newlyUploadedPath = null;
    let databaseSaved = false;

    try {
      if (selectedImage) {
        newlyUploadedPath = await uploadImage(selectedImage);
      }

      const values = {
        title,
        description,
        technologies,
        github_url: form.github_url.trim(),
        demo_url: form.demo_url.trim(),
        status: form.status,
        sort_order: sortOrder,
        image_path: newlyUploadedPath || existingImagePath,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (editingId !== null) {
        result = await supabase
          .from("portfolio_projects")
          .update(values)
          .eq("id", editingId)
          .select("id")
          .single();
      } else {
        result = await supabase
          .from("portfolio_projects")
          .insert(values)
          .select("id")
          .single();
      }

      if (result.error) throw result.error;

      databaseSaved = true;

      const oldImage = existingImagePath;

      resetForm();

      setSuccess(
        editingId !== null
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      // The database already points to the new image.
      // Cleanup is best-effort; it must not undo a successful save.
      if (
        newlyUploadedPath &&
        oldImage &&
        newlyUploadedPath !== oldImage
      ) {
        try {
          await removeImage(oldImage);
        } catch (cleanupError) {
          console.warn("Old project image cleanup failed:", cleanupError);
          setSuccess(
            "Project saved. The old image could not be removed."
          );
        }
      }

      await loadProjects();
    } catch (err) {
      // Only remove the new upload if saving the database failed.
      if (newlyUploadedPath && !databaseSaved) {
        try {
          await removeImage(newlyUploadedPath);
        } catch (cleanupError) {
          console.warn(
            "Unused uploaded image cleanup failed:",
            cleanupError
          );
        }
      }

      setError(err.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(project) {
    setEditingId(project.id);
    setExistingImagePath(project.image_path || null);
    setSelectedImage(null);

    const input = document.getElementById("project-image-input");
    if (input) input.value = "";

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: (project.technologies || []).join(", "),
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      status: project.status || "Completed",
      sort_order: project.sort_order ?? 0,
    });

    setError("");
    setSuccess("");

    document.getElementById("admin-project-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title}"?`)) return;

    setDeletingId(project.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: deleteError } = await supabase
        .from("portfolio_projects")
        .delete()
        .eq("id", project.id)
        .select("id")
        .single();

      if (deleteError) throw deleteError;

      if (!data) throw new Error("Project could not be deleted.");

      if (editingId === project.id) resetForm();

      setSuccess("Project deleted successfully!");

      // Delete the image only after the project record is deleted.
      if (project.image_path) {
        try {
          await removeImage(project.image_path);
        } catch (cleanupError) {
          console.warn("Project image cleanup failed:", cleanupError);
          setSuccess(
            "Project deleted. Its image could not be removed."
          );
        }
      }

      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-projects-container">
      <div className="admin-projects-heading">
        <h2>📁 Projects Management</h2>
        <p>Add, edit, and delete your portfolio projects.</p>
      </div>

      <form
        id="admin-project-form"
        className="admin-projects-form"
        onSubmit={handleSave}
      >
        <h3>
          {editingId !== null ? "Edit Project" : "Add New Project"}
        </h3>

        <div className="admin-projects-field">
          <label htmlFor="project-title">Project Title</label>
          <input
            id="project-title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Portfolio Website"
            maxLength={150}
            required
          />
        </div>

        <div className="admin-projects-field">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your project..."
            rows={5}
            maxLength={5000}
            required
          />
        </div>

        <div className="admin-projects-field">
          <label htmlFor="project-technologies">Technologies</label>
          <input
            id="project-technologies"
            type="text"
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, JavaScript, CSS, Supabase"
          />
          <small>Separate technologies using commas.</small>
        </div>

        <div className="admin-projects-field">
          <label htmlFor="project-github">GitHub URL</label>
          <input
            id="project-github"
            type="url"
            name="github_url"
            value={form.github_url}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="admin-projects-field">
          <label htmlFor="project-demo">Live Demo URL</label>
          <input
            id="project-demo"
            type="url"
            name="demo_url"
            value={form.demo_url}
            onChange={handleChange}
            placeholder="https://your-project.vercel.app"
          />
        </div>

        <div className="admin-projects-row">
          <div className="admin-projects-field">
            <label htmlFor="project-status">Status</label>
            <select
              id="project-status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
            </select>
          </div>

          <div className="admin-projects-field">
            <label htmlFor="project-order">Display Order</label>
            <input
              id="project-order"
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </div>
        </div>

        <div className="admin-projects-field">
          <label htmlFor="project-image-input">
            Project Screenshot
          </label>
          <input
            id="project-image-input"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={saving}
          />
          <small>JPG, PNG, or WebP. Maximum size: 5 MB.</small>

          {selectedImage && (
            <p className="admin-projects-selected">
              Selected: {selectedImage.name}
            </p>
          )}

          {!selectedImage && existingImagePath && (
            <img
              src={getImageUrl(existingImagePath)}
              alt="Current project"
              className="admin-projects-current-image"
            />
          )}
        </div>

        {error && (
          <div className="admin-projects-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-projects-success" role="status">
            {success}
          </div>
        )}

        <div className="admin-projects-actions">
          <button
            type="submit"
            className="admin-projects-save"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Update Project"
                : "Add Project"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="admin-projects-cancel"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-projects-list-heading">
        <h3>Saved Projects</h3>
        <span>{projects.length} projects</span>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects saved yet.</p>
      ) : (
        <div className="admin-projects-grid">
          {projects.map((project) => (
            <article className="admin-project-card" key={project.id}>
              {project.image_path && (
                <img
                  src={getImageUrl(project.image_path)}
                  alt={project.title}
                  className="admin-project-card-image"
                />
              )}

              <div className="admin-project-card-body">
                <div className="admin-project-card-top">
                  <h4>{project.title}</h4>
                  <span>{project.status}</span>
                </div>

                <p>{project.description}</p>

                <div className="admin-project-tags">
                  {(project.technologies || []).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="admin-project-links">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>

                <div className="admin-project-card-actions">
                  <button
                    type="button"
                    className="admin-projects-edit"
                    onClick={() => handleEdit(project)}
                    disabled={saving || deletingId !== null}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-projects-delete"
                    onClick={() => handleDelete(project)}
                    disabled={saving || deletingId !== null}
                  >
                    {deletingId === project.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProjects;