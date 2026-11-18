// ==========================================
// REACT HOOKS
// ==========================================

import { useEffect, useState } from "react";

// Supabase connection
import { supabase } from "../lib/supabase";

// Existing CSS
import "./Experience.css";

// ==========================================
// EXPERIENCE COMPONENT
// ==========================================

function Experience() {

    // ==========================================
    // STATE
    // ==========================================

    const [education, setEducation] = useState([]);

    const [experiences, setExperiences] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ==========================================
    // LOAD EDUCATION AND EXPERIENCE
    // ==========================================

    useEffect(() => {

        let active = true;

        async function loadData() {

            try {

                setLoading(true);
                setError("");

                // Fetch education and experience together
                const [
                    educationResponse,
                    experienceResponse
                ] = await Promise.all([

                    supabase
                        .from("portfolio_education")
                        .select(
                            "id, institution, qualification, period, location, sort_order"
                        )
                        .order("sort_order", {
                            ascending: true
                        })
                        .order("id", {
                            ascending: true
                        }),

                    supabase
                        .from("portfolio_experience")
                        .select(
                            "id, organization, position, period, location, duties, sort_order"
                        )
                        .order("sort_order", {
                            ascending: true
                        })
                        .order("id", {
                            ascending: true
                        })

                ]);

                // Check errors
                if (educationResponse.error) {
                    throw educationResponse.error;
                }

                if (experienceResponse.error) {
                    throw experienceResponse.error;
                }

                if (active) {

                    setEducation(
                        educationResponse.data || []
                    );

                    setExperiences(
                        experienceResponse.data || []
                    );

                }

            } catch (err) {

                console.error(
                    "Failed to load education and experience:",
                    err
                );

                if (active) {

                    setError(
                        "Unable to load education and experience. Please try again."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        }

        loadData();

        return () => {
            active = false;
        };

    }, []);

    // ==========================================
    // COMPONENT INTERFACE
    // ==========================================

    return (

        <section
            id="experience"
            className="experience-section"
        >

            {/* MAIN HEADING */}

            <div className="experience-heading">

                <h2>
                    Education & Experience
                </h2>

                <p>
                    My academic and professional background
                </p>

            </div>

            {/* LOADING MESSAGE */}

            {loading && (

                <p role="status">
                    Loading education and experience...
                </p>

            )}

            {/* ERROR MESSAGE */}

            {!loading && error && (

                <p role="alert">
                    {error}
                </p>

            )}

            {/* EDUCATION AND EXPERIENCE */}

            {!loading && !error && (

                <>

                    {/* ======================================
                        EDUCATION SECTION
                    ====================================== */}

                    <div className="education-area">

                        <h3>🎓 Education</h3>

                        {education.length === 0 ? (

                            <p>
                                No education records available.
                            </p>

                        ) : (

                            education.map((item) => (

                                <div
                                    className="education-card"
                                    key={item.id}
                                >

                                    {/* Study Period */}

                                    <span className="experience-date">
                                        {item.period}
                                    </span>

                                    {/* Qualification */}

                                    <h4>
                                        {item.qualification}
                                    </h4>

                                    {/* Institution */}

                                    <h5>
                                        {item.institution}
                                    </h5>

                                    {/* Location */}

                                    <p>
                                        {item.location}
                                    </p>

                                </div>

                            ))

                        )}

                    </div>

                    {/* ======================================
                        PROFESSIONAL EXPERIENCE SECTION
                    ====================================== */}

                    <div className="professional-area">

                        <h3>
                            💼 Professional Experience
                        </h3>

                        {/* Two-column card layout */}

                        <div className="professional-grid">

                            {experiences.length === 0 ? (

                                <p>
                                    No professional experience
                                    records available.
                                </p>

                            ) : (

                                experiences.map((item) => (

                                    <div
                                        className="professional-card"
                                        key={item.id}
                                    >

                                        {/* Organization */}

                                        <h4>
                                            {item.organization}
                                        </h4>

                                        {/* Period */}

                                        <span className="experience-date">
                                            {item.period}
                                        </span>

                                        {/* Job Title */}

                                        <h5>
                                            {item.position}
                                        </h5>

                                        {/* Location */}

                                        <p>
                                            {item.location}
                                        </p>

                                        {/* Responsibilities */}

                                        <ul>

                                            {(item.duties || []).map(
                                                (duty, index) => (

                                                    <li key={index}>
                                                        {duty}
                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                </>

            )}

        </section>

    );

}

export default Experience;