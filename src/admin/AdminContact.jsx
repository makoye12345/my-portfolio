// =====================================
// REACT HOOKS
// =====================================

import { useEffect, useState } from "react";

// Supabase connection
import { supabase } from "../lib/supabase";

// Custom CSS
import "./AdminContact.css";

// =====================================
// EMPTY CONTACT FORM
// =====================================

const emptyForm = {

    email: "",

    phone: "",

    location: "",

    github_url: "",

    linkedin_url: "",

    whatsapp_number: ""

};

// =====================================
// ADMIN CONTACT COMPONENT
// =====================================

function AdminContact() {

    // Contact information
    const [form, setForm] = useState({
        ...emptyForm
    });

    // Loading states
    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    // Feedback messages
    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =====================================
    // LOAD CONTACT FROM SUPABASE
    // =====================================

    useEffect(() => {

        let active = true;

        async function loadContact() {

            try {

                setLoading(true);
                setError("");

                const {
                    data,
                    error: fetchError
                } = await supabase
                    .from("portfolio_contact")
                    .select(
                        "email, phone, location, github_url, linkedin_url, whatsapp_number"
                    )
                    .eq("id", 1)
                    .single();

                if (fetchError) {
                    throw fetchError;
                }

                if (active) {

                    setForm({

                        email: data.email || "",

                        phone: data.phone || "",

                        location: data.location || "",

                        github_url: data.github_url || "",

                        linkedin_url: data.linkedin_url || "",

                        whatsapp_number:
                            data.whatsapp_number || ""

                    });

                }

            } catch (err) {

                if (active) {

                    setError(
                        err.message ||
                        "Unable to load contact information."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        }

        loadContact();

        return () => {
            active = false;
        };

    }, []);

    // =====================================
    // HANDLE INPUT CHANGES
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
    // SAVE CONTACT INFORMATION
    // =====================================

    async function handleSave(event) {

        event.preventDefault();

        const values = {

            email: form.email.trim(),

            phone: form.phone.trim(),

            location: form.location.trim(),

            github_url: form.github_url.trim(),

            linkedin_url: form.linkedin_url.trim(),

            whatsapp_number:
                form.whatsapp_number.trim()

        };

        // Validate required fields
        if (
            !values.email ||
            !values.phone ||
            !values.location
        ) {

            setError(
                "Please complete Email, Phone and Location."
            );

            return;
        }

        // Validate web links
        for (const field of ["github_url", "linkedin_url"]) {

            if (values[field]) {

                try {

                    const url = new URL(values[field]);

                    if (
                        url.protocol !== "https:" &&
                        url.protocol !== "http:"
                    ) {
                        throw new Error("Invalid protocol");
                    }

                } catch {

                    setError(
                        "GitHub and LinkedIn must contain valid HTTP or HTTPS URLs."
                    );

                    return;
                }

            }

        }

        // WhatsApp should contain digits only
        if (
            values.whatsapp_number &&
            !/^\d{8,15}$/.test(values.whatsapp_number)
        ) {

            setError(
                "WhatsApp number must contain 8–15 digits without + or spaces."
            );

            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const {
                data,
                error: updateError
            } = await supabase
                .from("portfolio_contact")
                .update({

                    ...values,

                    updated_at: new Date().toISOString()

                })
                .eq("id", 1)
                .select("id")
                .single();

            if (updateError) {
                throw updateError;
            }

            if (!data) {

                throw new Error(
                    "Contact information could not be updated."
                );

            }

            setSuccess(
                "Contact information updated successfully!"
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to save contact information."
            );

        } finally {

            setSaving(false);

        }

    }

    // =====================================
    // LOADING SCREEN
    // =====================================

    if (loading) {

        return (

            <div className="admin-contact-container">

                <p>Loading contact information...</p>

            </div>

        );

    }

    // =====================================
    // CONTACT MANAGEMENT FORM
    // =====================================

    return (

        <div className="admin-contact-container">

            {/* PAGE HEADING */}

            <div className="admin-contact-heading">

                <h2>📞 Contact Management</h2>

                <p>
                    Update your contact information
                    and social media links.
                </p>

            </div>

            {/* CONTACT FORM */}

            <form
                className="admin-contact-form"
                onSubmit={handleSave}
            >

                {/* EMAIL */}

                <div className="admin-contact-field">

                    <label htmlFor="contact-email">
                        Email Address
                    </label>

                    <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        maxLength={254}
                        required
                    />

                </div>

                {/* PHONE */}

                <div className="admin-contact-field">

                    <label htmlFor="contact-phone">
                        Phone Number
                    </label>

                    <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+255..."
                        maxLength={30}
                        required
                    />

                </div>

                {/* LOCATION */}

                <div className="admin-contact-field">

                    <label htmlFor="contact-location">
                        Location
                    </label>

                    <input
                        id="contact-location"
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Dodoma, Tanzania"
                        maxLength={150}
                        required
                    />

                </div>

                {/* GITHUB */}

                <div className="admin-contact-field">

                    <label htmlFor="contact-github">
                        GitHub URL
                    </label>

                    <input
                        id="contact-github"
                        type="url"
                        name="github_url"
                        value={form.github_url}
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                    />

                </div>

                {/* LINKEDIN */}

                <div className="admin-contact-field">

                    <label htmlFor="contact-linkedin">
                        LinkedIn URL
                    </label>

                    <input
                        id="contact-linkedin"
                        type="url"
                        name="linkedin_url"
                        value={form.linkedin_url}
                        onChange={handleChange}
                        placeholder="https://www.linkedin.com/in/..."
                    />

                </div>

                {/* WHATSAPP */}

                <div className="admin-contact-field">

                    <label htmlFor="contact-whatsapp">
                        WhatsApp Number
                    </label>

                    <input
                        id="contact-whatsapp"
                        type="tel"
                        name="whatsapp_number"
                        value={form.whatsapp_number}
                        onChange={handleChange}
                        placeholder="255612470595"
                    />

                    <small>
                        Enter country code and phone number
                        without + or spaces.
                    </small>

                </div>

                {/* ERROR MESSAGE */}

                {error && (

                    <div
                        className="admin-contact-error"
                        role="alert"
                    >
                        {error}
                    </div>

                )}

                {/* SUCCESS MESSAGE */}

                {success && (

                    <div
                        className="admin-contact-success"
                        role="status"
                    >
                        {success}
                    </div>

                )}

                {/* SAVE BUTTON */}

                <button
                    type="submit"
                    className="admin-contact-save"
                    disabled={saving}
                >

                    {saving
                        ? "Saving Changes..."
                        : "Save Changes"}

                </button>

            </form>

        </div>

    );

}

export default AdminContact;