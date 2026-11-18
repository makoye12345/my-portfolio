// ==========================================
// REACT HOOKS
// ==========================================

import { useEffect, useState } from "react";

// Supabase connection
import { supabase } from "../lib/supabase";

// Existing Skills CSS
import "./Skills.css";

// ==========================================
// SKILL CATEGORY ORDER
// ==========================================

const categoryOrder = [
    "Frontend Development",
    "Backend Development",
    "Databases",
    "Development Tools"
];

// ==========================================
// SKILLS COMPONENT
// ==========================================

function Skills() {

    // Skills retrieved from Supabase
    const [skills, setSkills] = useState([]);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Error state
    const [error, setError] = useState("");

    // ==========================================
    // FETCH SKILLS FROM SUPABASE
    // ==========================================

    useEffect(() => {

        let active = true;

        async function loadSkills() {

            try {

                setLoading(true);
                setError("");

                const {
                    data,
                    error: fetchError
                } = await supabase
                    .from("portfolio_skills")
                    .select(
                        "id, skill_name, category, sort_order"
                    )
                    .order("sort_order", {
                        ascending: true
                    })
                    .order("id", {
                        ascending: true
                    });

                if (fetchError) {
                    throw fetchError;
                }

                if (active) {
                    setSkills(data || []);
                }

            } catch (err) {

                console.error(
                    "Failed to load skills:",
                    err
                );

                if (active) {

                    setError(
                        "Unable to load skills. Please try again."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        }

        loadSkills();

        return () => {
            active = false;
        };

    }, []);

    // ==========================================
    // GROUP SKILLS BY CATEGORY
    // ==========================================

    const groupedSkills = skills.reduce(
        (groups, skill) => {

            const category = skill.category;

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(skill);

            return groups;

        },
        {}
    );

    // ==========================================
    // SORT CATEGORIES
    // ==========================================

    const categories = Object.keys(groupedSkills).sort(
        (a, b) => {

            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);

            const orderA =
                indexA === -1
                    ? categoryOrder.length
                    : indexA;

            const orderB =
                indexB === -1
                    ? categoryOrder.length
                    : indexB;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            return a.localeCompare(b);

        }
    );

    // ==========================================
    // SKILLS USER INTERFACE
    // ==========================================

    return (

        <section
            id="skills"
            className="skills-section"
        >

            {/* SECTION HEADING */}

            <div className="skills-heading">

                <h2>My Technical Skills</h2>

                <p>
                    Technologies and tools I use
                    to develop modern web applications.
                </p>

            </div>

            {/* LOADING MESSAGE */}

            {loading && (

                <p role="status">
                    Loading skills...
                </p>

            )}

            {/* ERROR MESSAGE */}

            {!loading && error && (

                <p role="alert">
                    {error}
                </p>

            )}

            {/* SKILLS CONTAINER */}

            {!loading && !error && (

                <div className="skills-container">

                    {/* EMPTY STATE */}

                    {categories.length === 0 && (

                        <p>
                            No skills available yet.
                        </p>

                    )}

                    {/* SKILL CATEGORY CARDS */}

                    {categories.map((category) => (

                        <div
                            className="skills-card"
                            key={category}
                        >

                            {/* CATEGORY TITLE */}

                            <h3>
                                {category}
                            </h3>

                            {/* TECHNOLOGIES */}

                            <div className="skills-list">

                                {groupedSkills[category].map(
                                    (skill) => (

                                        <span
                                            className="skill-badge"
                                            key={skill.id}
                                        >
                                            {skill.skill_name}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    );

}

export default Skills;