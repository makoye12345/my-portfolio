// =====================================
// REACT HOOKS
// =====================================

import { useEffect, useState } from "react";

// Supabase connection
import { supabase } from "../lib/supabase";

// Custom CSS
import "./AdminSkills.css";

// =====================================
// SKILL CATEGORIES
// =====================================

const categories = [
    "Frontend Development",
    "Backend Development",
    "Databases",
    "Development Tools"
];

// =====================================
// EMPTY FORM
// =====================================

const emptyForm = {
    skill_name: "",
    category: "Frontend Development"
};

// =====================================
// ADMIN SKILLS COMPONENT
// =====================================

function AdminSkills() {

    // Skills from Supabase
    const [skills, setSkills] = useState([]);

    // Form data
    const [form, setForm] = useState(emptyForm);

    // ID of skill being edited
    const [editingId, setEditingId] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Feedback
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================
    // FETCH SKILLS
    // =====================================

    async function loadSkills() {

        setLoading(true);
        setError("");

        try {

            const { data, error: fetchError } =
                await supabase
                    .from("portfolio_skills")
                    .select("id, skill_name, category, sort_order")
                    .order("category", { ascending: true })
                    .order("sort_order", { ascending: true })
                    .order("id", { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            setSkills(data || []);

        } catch (err) {

            setError(
                err.message || "Unable to load skills."
            );

        } finally {

            setLoading(false);

        }

    }

    // =====================================
    // LOAD ON PAGE OPEN
    // =====================================

    useEffect(() => {
        loadSkills();
    }, []);

    // =====================================
    // INPUT CHANGES
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
    // ADD OR UPDATE SKILL
    // =====================================

    async function handleSave(event) {

        event.preventDefault();

        const skillName = form.skill_name.trim();

        if (!skillName) {
            setError("Please enter a skill name.");
            return;
        }

        if (!categories.includes(form.category)) {
            setError("Please select a valid category.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const values = {
                skill_name: skillName,
                category: form.category
            };

            if (editingId !== null) {

                // UPDATE EXISTING SKILL
                const { data, error: updateError } =
                    await supabase
                        .from("portfolio_skills")
                        .update(values)
                        .eq("id", editingId)
                        .select("id")
                        .single();

                if (updateError) {
                    throw updateError;
                }

                if (!data) {
                    throw new Error(
                        "Skill could not be updated."
                    );
                }

                setSuccess("Skill updated successfully!");

            } else {

                // INSERT NEW SKILL
                const { data, error: insertError } =
                    await supabase
                        .from("portfolio_skills")
                        .insert(values)
                        .select("id")
                        .single();

                if (insertError) {
                    throw insertError;
                }

                if (!data) {
                    throw new Error(
                        "Skill could not be added."
                    );
                }

                setSuccess("Skill added successfully!");

            }

            resetForm();
            await loadSkills();

        } catch (err) {

            setError(
                err.message || "Unable to save skill."
            );

        } finally {

            setSaving(false);

        }

    }

    // =====================================
    // SELECT SKILL FOR EDITING
    // =====================================

    function handleEdit(skill) {

        setEditingId(skill.id);

        setForm({
            skill_name: skill.skill_name,
            category: skill.category
        });

        setError("");
        setSuccess("");

        // Return to the form
        document.getElementById("admin-skill-form")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }

    // =====================================
    // DELETE SKILL
    // =====================================

    async function handleDelete(skill) {

        const confirmed = window.confirm(
            `Delete "${skill.skill_name}"?`
        );

        if (!confirmed) return;

        setDeletingId(skill.id);
        setError("");
        setSuccess("");

        try {

            const { data, error: deleteError } =
                await supabase
                    .from("portfolio_skills")
                    .delete()
                    .eq("id", skill.id)
                    .select("id")
                    .single();

            if (deleteError) {
                throw deleteError;
            }

            if (!data) {
                throw new Error(
                    "Skill could not be deleted."
                );
            }

            if (editingId === skill.id) {
                resetForm();
            }

            setSuccess("Skill deleted successfully!");

            await loadSkills();

        } catch (err) {

            setError(
                err.message || "Unable to delete skill."
            );

        } finally {

            setDeletingId(null);

        }

    }

    // =====================================
    // COMPONENT UI
    // =====================================

    return (

        <div className="admin-skills-container">

            {/* HEADING */}
            <div className="admin-skills-heading">

                <h2>💻 Skills Management</h2>

                <p>
                    Add, edit and delete your technical skills.
                </p>

            </div>

            {/* SKILL FORM */}
            <form
                id="admin-skill-form"
                className="admin-skills-form"
                onSubmit={handleSave}
            >

                <h3>
                    {editingId !== null
                        ? "Edit Skill"
                        : "Add New Skill"}
                </h3>

                {/* SKILL NAME */}
                <div className="admin-skills-field">

                    <label htmlFor="skill-name">
                        Skill Name
                    </label>

                    <input
                        id="skill-name"
                        type="text"
                        name="skill_name"
                        value={form.skill_name}
                        onChange={handleChange}
                        placeholder="e.g. React.js"
                        maxLength={100}
                        required
                    />

                </div>

                {/* CATEGORY */}
                <div className="admin-skills-field">

                    <label htmlFor="skill-category">
                        Category
                    </label>

                    <select
                        id="skill-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                </div>

                {/* FORM ACTIONS */}
                <div className="admin-skills-actions">

                    <button
                        type="submit"
                        className="admin-skills-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingId !== null
                                ? "Update Skill"
                                : "Add Skill"}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            className="admin-skills-cancel"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </form>

            {/* FEEDBACK */}
            {error && (
                <div
                    className="admin-skills-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="admin-skills-success"
                    role="status"
                >
                    {success}
                </div>
            )}

            {/* SKILLS LIST */}
            <div className="admin-skills-list">

                <div className="admin-skills-list-heading">

                    <h3>Your Skills</h3>

                    <span>{skills.length} skills</span>

                </div>

                {loading ? (

                    <p>Loading skills...</p>

                ) : skills.length === 0 ? (

                    <p>
                        No skills added yet.
                        Use the form above to add your first skill.
                    </p>

                ) : (

                    <div className="admin-skills-table-wrap">

                        <table className="admin-skills-table">

                            <thead>
                                <tr>
                                    <th>Skill</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {skills.map((skill) => (

                                    <tr key={skill.id}>

                                        <td>
                                            {skill.skill_name}
                                        </td>

                                        <td>
                                            {skill.category}
                                        </td>

                                        <td>
                                            <div className="admin-skills-row-actions">

                                                <button
                                                    type="button"
                                                    className="admin-skills-edit"
                                                    onClick={() =>
                                                        handleEdit(skill)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-skills-delete"
                                                    onClick={() =>
                                                        handleDelete(skill)
                                                    }
                                                    disabled={
                                                        deletingId === skill.id
                                                    }
                                                >
                                                    {deletingId === skill.id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))}
                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default AdminSkills;