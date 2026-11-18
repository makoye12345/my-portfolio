// =====================================
// REACT HOOKS
// =====================================

import { useEffect, useState } from "react";

// Supabase connection
import { supabase } from "../lib/supabase";

// Custom CSS
import "./AdminEducation.css";

// =====================================
// EMPTY EDUCATION FORM
// =====================================

const emptyForm = {
    institution: "",
    qualification: "",
    period: "",
    location: ""
};

// =====================================
// ADMIN EDUCATION COMPONENT
// =====================================

function AdminEducation() {

    // Saved education records
    const [education, setEducation] = useState([]);

    // Form information
    const [form, setForm] = useState({ ...emptyForm });

    // Current record being edited
    const [editingId, setEditingId] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Feedback
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================
    // FETCH EDUCATION
    // =====================================

    async function loadEducation() {
        setLoading(true);

        try {
            const { data, error: fetchError } =
                await supabase
                    .from("portfolio_education")
                    .select(
                        "id, institution, qualification, period, location, sort_order"
                    )
                    .order("sort_order", { ascending: true })
                    .order("id", { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            setEducation(data || []);

        } catch (err) {

            setError(
                err.message || "Unable to load education."
            );

        } finally {
            setLoading(false);
        }
    }

    // =====================================
    // LOAD RECORDS
    // =====================================

    useEffect(() => {
        loadEducation();
    }, []);

    // =====================================
    // HANDLE INPUT CHANGE
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
    // ADD OR UPDATE EDUCATION
    // =====================================

    async function handleSave(event) {

        event.preventDefault();

        const institution = form.institution.trim();
        const qualification = form.qualification.trim();
        const period = form.period.trim();
        const location = form.location.trim();

        if (
            !institution ||
            !qualification ||
            !period ||
            !location
        ) {
            setError("Please complete all required fields.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const values = {
                institution,
                qualification,
                period,
                location
            };

            if (editingId !== null) {

                // UPDATE EXISTING EDUCATION
                const {
                    data,
                    error: updateError
                } = await supabase
                    .from("portfolio_education")
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
                        "Education could not be updated."
                    );
                }

                setSuccess(
                    "Education updated successfully!"
                );

            } else {

                // ADD NEW EDUCATION
                const {
                    data,
                    error: insertError
                } = await supabase
                    .from("portfolio_education")
                    .insert(values)
                    .select("id")
                    .single();

                if (insertError) {
                    throw insertError;
                }

                if (!data) {
                    throw new Error(
                        "Education could not be added."
                    );
                }

                setSuccess(
                    "Education added successfully!"
                );
            }

            resetForm();
            await loadEducation();

        } catch (err) {

            setError(
                err.message || "Unable to save education."
            );

        } finally {
            setSaving(false);
        }
    }

    // =====================================
    // EDIT EDUCATION
    // =====================================

    function handleEdit(item) {

        setEditingId(item.id);

        setForm({
            institution: item.institution,
            qualification: item.qualification,
            period: item.period,
            location: item.location
        });

        setError("");
        setSuccess("");

        document
            .getElementById("admin-education-form")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }

    // =====================================
    // DELETE EDUCATION
    // =====================================

    async function handleDelete(item) {

        const confirmed = window.confirm(
            `Delete education from "${item.institution}"?`
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
                .from("portfolio_education")
                .delete()
                .eq("id", item.id)
                .select("id")
                .single();

            if (deleteError) {
                throw deleteError;
            }

            if (!data) {
                throw new Error(
                    "Education could not be deleted."
                );
            }

            if (editingId === item.id) {
                resetForm();
            }

            setSuccess(
                "Education deleted successfully!"
            );

            await loadEducation();

        } catch (err) {

            setError(
                err.message || "Unable to delete education."
            );

        } finally {
            setDeletingId(null);
        }
    }

    // =====================================
    // COMPONENT UI
    // =====================================

    return (

        <div className="admin-education-container">

            {/* PAGE HEADING */}
            <div className="admin-education-heading">
                <h2>🎓 Education Management</h2>

                <p>
                    Add, edit, and delete your academic
                    qualifications.
                </p>
            </div>

            {/* EDUCATION FORM */}
            <form
                id="admin-education-form"
                className="admin-education-form"
                onSubmit={handleSave}
            >

                <h3>
                    {editingId !== null
                        ? "Edit Education"
                        : "Add New Education"}
                </h3>

                {/* INSTITUTION */}
                <div className="admin-education-field">
                    <label htmlFor="education-institution">
                        Institution
                    </label>

                    <input
                        id="education-institution"
                        type="text"
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        placeholder="e.g. St. John's University of Tanzania"
                        maxLength={150}
                        required
                    />
                </div>

                {/* QUALIFICATION */}
                <div className="admin-education-field">
                    <label htmlFor="education-qualification">
                        Qualification
                    </label>

                    <input
                        id="education-qualification"
                        type="text"
                        name="qualification"
                        value={form.qualification}
                        onChange={handleChange}
                        placeholder="e.g. Bachelor of Science in Information Technology"
                        maxLength={200}
                        required
                    />
                </div>

                {/* PERIOD */}
                <div className="admin-education-field">
                    <label htmlFor="education-period">
                        Study Period
                    </label>

                    <input
                        id="education-period"
                        type="text"
                        name="period"
                        value={form.period}
                        onChange={handleChange}
                        placeholder="e.g. October 2022 – August 2025"
                        maxLength={100}
                        required
                    />
                </div>

                {/* LOCATION */}
                <div className="admin-education-field">
                    <label htmlFor="education-location">
                        Location
                    </label>

                    <input
                        id="education-location"
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Dodoma, Tanzania"
                        maxLength={150}
                        required
                    />
                </div>

                {/* BUTTONS */}
                <div className="admin-education-actions">

                    <button
                        type="submit"
                        className="admin-education-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingId !== null
                                ? "Update Education"
                                : "Add Education"}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            className="admin-education-cancel"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    )}

                </div>
            </form>

            {/* ERROR MESSAGE */}
            {error && (
                <div
                    className="admin-education-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
                <div
                    className="admin-education-success"
                    role="status"
                >
                    {success}
                </div>
            )}

            {/* SAVED EDUCATION */}
            <div className="admin-education-list">

                <div className="admin-education-list-heading">
                    <h3>Saved Education</h3>

                    <span>
                        {education.length} records
                    </span>
                </div>

                {loading ? (

                    <p>Loading education...</p>

                ) : education.length === 0 ? (

                    <p>
                        No education records found.
                    </p>

                ) : (

                    <div className="admin-education-grid">

                        {education.map((item) => (

                            <div
                                className="admin-education-card"
                                key={item.id}
                            >

                                <h4>{item.institution}</h4>

                                <span className="admin-education-date">
                                    {item.period}
                                </span>

                                <h5>{item.qualification}</h5>

                                <p>{item.location}</p>

                                <div className="admin-education-card-actions">

                                    <button
                                        type="button"
                                        className="admin-education-edit"
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-education-delete"
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

export default AdminEducation;