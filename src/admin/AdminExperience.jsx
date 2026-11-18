// =====================================
// REACT HOOKS
// =====================================

import { useEffect, useState } from "react";

// Supabase connection
import { supabase } from "../lib/supabase";

// Custom CSS
import "./AdminExperience.css";

// =====================================
// EMPTY EXPERIENCE FORM
// =====================================

const emptyForm = {
    organization: "",
    position: "",
    period: "",
    location: "",
    duties: ""
};

// =====================================
// ADMIN EXPERIENCE COMPONENT
// =====================================

function AdminExperience() {

    // Saved experiences
    const [experiences, setExperiences] = useState([]);

    // Form state
    const [form, setForm] = useState({ ...emptyForm });

    // Editing state
    const [editingId, setEditingId] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Feedback messages
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================
    // FETCH EXPERIENCE FROM SUPABASE
    // =====================================

    async function loadExperiences() {
        setLoading(true);

        try {
            const {
                data,
                error: fetchError
            } = await supabase
                .from("portfolio_experience")
                .select(
                    "id, organization, position, period, location, duties, sort_order"
                )
                .order("sort_order", { ascending: true })
                .order("id", { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            setExperiences(data || []);

        } catch (err) {
            setError(
                err.message || "Unable to load experience."
            );
        } finally {
            setLoading(false);
        }
    }

    // =====================================
    // LOAD ON COMPONENT MOUNT
    // =====================================

    useEffect(() => {
        loadExperiences();
    }, []);

    // =====================================
    // HANDLE FORM INPUT
    // =====================================

    function handleChange(event) {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    }

    // =====================================
    // RESET FORM
    // =====================================

    function resetForm() {

        setForm({ ...emptyForm });

        setEditingId(null);
    }

    // =====================================
    // CONVERT RESPONSIBILITIES
    // =====================================

    function parseDuties(text) {

        // One responsibility per line
        return text
            .split("\n")
            .map((duty) => duty.trim())
            .filter(Boolean);
    }

    // =====================================
    // ADD OR UPDATE EXPERIENCE
    // =====================================

    async function handleSave(event) {

        event.preventDefault();

        const organization = form.organization.trim();
        const position = form.position.trim();
        const period = form.period.trim();
        const location = form.location.trim();
        const duties = parseDuties(form.duties);

        if (
            !organization ||
            !position ||
            !period ||
            !location
        ) {
            setError("Please complete all required fields.");
            return;
        }

        if (duties.length === 0) {
            setError("Enter at least one responsibility.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const values = {
                organization,
                position,
                period,
                location,
                duties
            };

            if (editingId !== null) {

                // UPDATE EXISTING EXPERIENCE
                const {
                    data,
                    error: updateError
                } = await supabase
                    .from("portfolio_experience")
                    .update({
                        ...values,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", editingId)
                    .select("id")
                    .single();

                if (updateError) {
                    throw updateError;
                }

                if (!data) {
                    throw new Error(
                        "Experience could not be updated."
                    );
                }

                setSuccess(
                    "Experience updated successfully!"
                );

            } else {

                // ADD NEW EXPERIENCE
                const {
                    data,
                    error: insertError
                } = await supabase
                    .from("portfolio_experience")
                    .insert(values)
                    .select("id")
                    .single();

                if (insertError) {
                    throw insertError;
                }

                if (!data) {
                    throw new Error(
                        "Experience could not be added."
                    );
                }

                setSuccess(
                    "Experience added successfully!"
                );
            }

            resetForm();
            await loadExperiences();

        } catch (err) {

            setError(
                err.message || "Unable to save experience."
            );

        } finally {
            setSaving(false);
        }
    }

    // =====================================
    // EDIT EXPERIENCE
    // =====================================

    function handleEdit(item) {

        setEditingId(item.id);

        setForm({
            organization: item.organization,
            position: item.position,
            period: item.period,
            location: item.location,
            duties: (item.duties || []).join("\n")
        });

        setError("");
        setSuccess("");

        document
            .getElementById("admin-experience-form")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }

    // =====================================
    // DELETE EXPERIENCE
    // =====================================

    async function handleDelete(item) {

        const confirmed = window.confirm(
            `Delete experience at "${item.organization}"?`
        );

        if (!confirmed) return;

        setDeletingId(item.id);
        setError("");
        setSuccess("");

        try {

            const {
                data,
                error: deleteError
            } = await supabase
                .from("portfolio_experience")
                .delete()
                .eq("id", item.id)
                .select("id")
                .single();

            if (deleteError) {
                throw deleteError;
            }

            if (!data) {
                throw new Error(
                    "Experience could not be deleted."
                );
            }

            if (editingId === item.id) {
                resetForm();
            }

            setSuccess(
                "Experience deleted successfully!"
            );

            await loadExperiences();

        } catch (err) {

            setError(
                err.message || "Unable to delete experience."
            );

        } finally {
            setDeletingId(null);
        }
    }

    // =====================================
    // COMPONENT UI
    // =====================================

    return (
        <div className="admin-experience-container">

            {/* PAGE HEADING */}
            <div className="admin-experience-heading">
                <h2>💼 Professional Experience</h2>

                <p>
                    Add, edit, and delete your professional
                    work experience.
                </p>
            </div>

            {/* EXPERIENCE FORM */}
            <form
                id="admin-experience-form"
                className="admin-experience-form"
                onSubmit={handleSave}
            >

                <h3>
                    {editingId !== null
                        ? "Edit Experience"
                        : "Add New Experience"}
                </h3>

                {/* ORGANIZATION */}
                <div className="admin-experience-field">
                    <label htmlFor="experience-organization">
                        Organization
                    </label>

                    <input
                        id="experience-organization"
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="e.g. Wipa Education Center"
                        maxLength={150}
                        required
                    />
                </div>

                {/* JOB TITLE */}
                <div className="admin-experience-field">
                    <label htmlFor="experience-position">
                        Job Title
                    </label>

                    <input
                        id="experience-position"
                        type="text"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        placeholder="e.g. ICT Teaching and Computer Maintenance"
                        maxLength={150}
                        required
                    />
                </div>

                {/* PERIOD */}
                <div className="admin-experience-field">
                    <label htmlFor="experience-period">
                        Period
                    </label>

                    <input
                        id="experience-period"
                        type="text"
                        name="period"
                        value={form.period}
                        onChange={handleChange}
                        placeholder="e.g. April – July 2024"
                        maxLength={100}
                        required
                    />
                </div>

                {/* LOCATION */}
                <div className="admin-experience-field">
                    <label htmlFor="experience-location">
                        Location
                    </label>

                    <input
                        id="experience-location"
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Dodoma, Tanzania"
                        maxLength={150}
                        required
                    />
                </div>

                {/* RESPONSIBILITIES */}
                <div className="admin-experience-field">
                    <label htmlFor="experience-duties">
                        Responsibilities
                    </label>

                    <textarea
                        id="experience-duties"
                        name="duties"
                        value={form.duties}
                        onChange={handleChange}
                        rows={6}
                        placeholder={
                            "Teaching computer science.\n" +
                            "Repairing and maintaining computers.\n" +
                            "Designing announcements."
                        }
                        required
                    />

                    <small>
                        Enter one responsibility per line.
                    </small>
                </div>

                {/* FORM ACTIONS */}
                <div className="admin-experience-actions">

                    <button
                        type="submit"
                        className="admin-experience-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingId !== null
                                ? "Update Experience"
                                : "Add Experience"}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            className="admin-experience-cancel"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    )}

                </div>
            </form>

            {/* ERROR */}
            {error && (
                <div
                    className="admin-experience-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* SUCCESS */}
            {success && (
                <div
                    className="admin-experience-success"
                    role="status"
                >
                    {success}
                </div>
            )}

            {/* SAVED EXPERIENCE */}
            <div className="admin-experience-list">

                <div className="admin-experience-list-heading">
                    <h3>Saved Experience</h3>

                    <span>
                        {experiences.length} records
                    </span>
                </div>

                {loading ? (
                    <p>Loading experience...</p>
                ) : experiences.length === 0 ? (
                    <p>
                        No experience records found.
                    </p>
                ) : (
                    <div className="admin-experience-grid">

                        {experiences.map((item) => (

                            <div
                                className="admin-experience-card"
                                key={item.id}
                            >

                                <h4>{item.organization}</h4>

                                <span className="admin-experience-date">
                                    {item.period}
                                </span>

                                <h5>{item.position}</h5>

                                <p>{item.location}</p>

                                <ul>
                                    {(item.duties || []).map(
                                        (duty, index) => (
                                            <li key={index}>
                                                {duty}
                                            </li>
                                        )
                                    )}
                                </ul>

                                <div className="admin-experience-card-actions">

                                    <button
                                        type="button"
                                        className="admin-experience-edit"
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-experience-delete"
                                        onClick={() =>
                                            handleDelete(item)
                                        }
                                        disabled={
                                            deletingId === item.id
                                        }
                                    >
                                        {deletingId === item.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default AdminExperience;