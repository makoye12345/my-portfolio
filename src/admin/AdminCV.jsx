

import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import "./AdminCV.css";

// =====================================
// CONFIGURATION
// =====================================

const BUCKET_NAME = "portfolio-cv";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// =====================================
// ADMIN CV MANAGEMENT
// =====================================

function AdminCV() {

    // Current CV
    const [currentCV, setCurrentCV] = useState(null);

    // Selected PDF
    const [selectedFile, setSelectedFile] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    // Messages
    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =====================================
    // LOAD CURRENT CV
    // =====================================

    useEffect(() => {

        let active = true;

        async function loadCV() {

            try {

                setLoading(true);

                const {
                    data,
                    error: fetchError
                } = await supabase
                    .from("portfolio_cv")
                    .select(
                        "id, file_path, original_name, updated_at"
                    )
                    .eq("id", 1)
                    .single();

                if (fetchError) {
                    throw fetchError;
                }

                if (active) {
                    setCurrentCV(data);
                }

            } catch (err) {

                if (active) {

                    setError(
                        err.message ||
                        "Unable to load CV information."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        }

        loadCV();

        return () => {
            active = false;
        };

    }, []);


    // =====================================
    // SELECT PDF FILE
    // =====================================

    function handleFileChange(event) {

        const file = event.target.files?.[0];

        setError("");
        setSuccess("");

        if (!file) {

            setSelectedFile(null);
            return;

        }

        // Validate file extension and MIME type
        if (
            file.type !== "application/pdf" ||
            !file.name.toLowerCase().endsWith(".pdf")
        ) {

            setError("Please select a valid PDF file.");

            setSelectedFile(null);

            event.target.value = "";

            return;
        }

        // Validate maximum size
        if (file.size > MAX_FILE_SIZE) {

            setError(
                "Your CV must not exceed 5 MB."
            );

            setSelectedFile(null);

            event.target.value = "";

            return;
        }

        if (file.size === 0) {

            setError("The selected file is empty.");

            setSelectedFile(null);

            event.target.value = "";

            return;
        }

        setSelectedFile(file);

    }


    // =====================================
    // GET CURRENT PUBLIC CV URL
    // =====================================

    function getCVUrl(filePath) {

        if (!filePath) return "";

        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return data.publicUrl;

    }


    // =====================================
    // UPLOAD AND SAVE NEW CV
    // =====================================

    async function handleUpload(event) {

        event.preventDefault();

        if (!selectedFile) {

            setError("Please select a PDF file.");

            return;
        }

        if (!currentCV) {

            setError(
                "CV information has not loaded. Please refresh."
            );

            return;
        }

        setUploading(true);
        setError("");
        setSuccess("");

        // Unique storage path for every upload
        const filePath = `cv/${crypto.randomUUID()}.pdf`;

        let uploaded = false;

        try {

            // =====================================
            // UPLOAD FILE TO SUPABASE STORAGE
            // =====================================

            const {
                error: uploadError
            } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, selectedFile, {

                    contentType: "application/pdf",

                    cacheControl: "3600",

                    upsert: false

                });

            if (uploadError) {
                throw uploadError;
            }

            uploaded = true;

            // =====================================
            // UPDATE DATABASE RECORD
            // =====================================

            const {
                data,
                error: updateError
            } = await supabase
                .from("portfolio_cv")
                .update({

                    file_path: filePath,

                    original_name: selectedFile.name,

                    updated_at:
                        new Date().toISOString()

                })
                .eq("id", 1)
                .select(
                    "id, file_path, original_name, updated_at"
                )
                .single();

            if (updateError) {
                throw updateError;
            }

            // =====================================
            // UPDATE INTERFACE
            // =====================================

            const previousPath = currentCV.file_path;

            setCurrentCV(data);

            setSelectedFile(null);

            const fileInput =
                document.getElementById("cv-file-input");

            if (fileInput) {
                fileInput.value = "";
            }

            setSuccess(
                "Your CV has been uploaded successfully!"
            );

            // =====================================
            // REMOVE PREVIOUS CV
            // =====================================

            // Only remove the previous file AFTER
            // the database points to the new CV.

            if (
                previousPath &&
                previousPath !== filePath
            ) {

                const {
                    error: cleanupError
                } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([previousPath]);

                if (cleanupError) {

                    console.warn(
                        "Previous CV cleanup failed:",
                        cleanupError
                    );

                    setSuccess(
                        "New CV saved successfully. " +
                        "The previous file could not be removed."
                    );

                }

            }

        } catch (err) {

            // If upload succeeded but database update failed,
            // try to remove the unused newly uploaded file.

            if (uploaded) {

                const {
                    error: cleanupError
                } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([filePath]);

                if (cleanupError) {

                    console.warn(
                        "Unused CV cleanup failed:",
                        cleanupError
                    );

                }

            }

            setError(
                err.message ||
                "Unable to upload CV."
            );

        } finally {

            setUploading(false);

        }

    }


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="admin-cv-container">

                <p>Loading CV information...</p>

            </div>

        );

    }


    // =====================================
    // CV MANAGEMENT INTERFACE
    // =====================================

    return (

        <div className="admin-cv-container">

            {/* HEADING */}

            <div className="admin-cv-heading">

                <h2>📄 CV Management</h2>

                <p>
                    Upload and manage your professional
                    Curriculum Vitae.
                </p>

            </div>


            {/* CURRENT CV */}

            <div className="admin-cv-current">

                <h3>Current CV</h3>

                {currentCV?.file_path ? (

                    <div className="admin-cv-file-card">

                        <div className="admin-cv-file-icon">
                            📄
                        </div>

                        <div className="admin-cv-file-info">

                            <h4>
                                {currentCV.original_name ||
                                    "Curriculum Vitae"}
                            </h4>

                            <p>
                                Last updated:{" "}
                                {currentCV.updated_at
                                    ? new Date(
                                        currentCV.updated_at
                                    ).toLocaleDateString()
                                    : "Unknown"}
                            </p>

                        </div>

                        <a
                            href={getCVUrl(
                                currentCV.file_path
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-cv-view"
                        >
                            View CV ↗
                        </a>

                    </div>

                ) : (

                    <div className="admin-cv-empty">

                        <p>
                            No CV has been uploaded yet.
                        </p>

                    </div>

                )}

            </div>


            {/* UPLOAD FORM */}

            <form
                className="admin-cv-upload-form"
                onSubmit={handleUpload}
            >

                <h3>
                    {currentCV?.file_path
                        ? "Replace Current CV"
                        : "Upload New CV"}
                </h3>

                <div className="admin-cv-field">

                    <label htmlFor="cv-file-input">
                        Select PDF File
                    </label>

                    <input
                        id="cv-file-input"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />

                    <small>
                        PDF format only. Maximum size: 5 MB.
                    </small>

                </div>


                {/* SELECTED FILE */}

                {selectedFile && (

                    <div className="admin-cv-selected">

                        <span>📄</span>

                        <div>

                            <strong>
                                {selectedFile.name}
                            </strong>

                            <p>
                                {(
                                    selectedFile.size /
                                    1024 /
                                    1024
                                ).toFixed(2)} MB
                            </p>

                        </div>

                    </div>

                )}


                {/* ERROR MESSAGE */}

                {error && (

                    <div
                        className="admin-cv-error"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                {/* SUCCESS MESSAGE */}

                {success && (

                    <div
                        className="admin-cv-success"
                        role="status"
                    >
                        {success}
                    </div>

                )}


                {/* UPLOAD BUTTON */}

                <button
                    type="submit"
                    className="admin-cv-upload-button"
                    disabled={
                        uploading ||
                        !selectedFile ||
                        !currentCV
                    }
                >

                    {uploading
                        ? "Uploading CV..."
                        : currentCV?.file_path
                            ? "Replace CV"
                            : "Upload CV"}

                </button>

            </form>

        </div>

    );

}

export default AdminCV;