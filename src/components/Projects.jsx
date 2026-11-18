import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import "./Projects.css";

// Existing project images
const localImages = {
    "E-Library Management System":
        "/images/elibrary.png",

    "E-Learning Management System":
        "/images/elearning.png",

    "Sales and Inventory Management System":
        "/images/inventory.png"
};

const placeholderImage =
    "/images/project-placeholder.svg";

function Projects() {

    // Projects retrieved from Supabase
    const [projects, setProjects] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================
    // FETCH PROJECTS FROM SUPABASE
    // =====================================

    useEffect(() => {

        let active = true;

        async function loadProjects() {

            try {

                setLoading(true);

                const {
                    data,
                    error: fetchError
                } = await supabase
                    .from("portfolio_projects")
                    .select(
                        "id, title, description, technologies, image_path, github_url, demo_url, status, sort_order"
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
                    setProjects(data || []);
                }

            } catch (err) {

                console.error(
                    "Failed to load projects:",
                    err
                );

                if (active) {
                    setError(
                        "Unable to load projects. Please try again."
                    );
                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        }

        loadProjects();

        return () => {
            active = false;
        };

    }, []);

    // =====================================
    // GET PROJECT IMAGE
    // =====================================

    function getProjectImage(project) {

        // Image uploaded through Admin Dashboard
        if (project.image_path) {

            const { data } = supabase.storage
                .from("portfolio-projects")
                .getPublicUrl(project.image_path);

            return data.publicUrl;
        }

        // Existing local image
        return (
            localImages[project.title] ||
            placeholderImage
        );
    }

    // =====================================
    // PROJECTS INTERFACE
    // =====================================

    return (

        <section
            id="projects"
            className="projects-section"
        >

            {/* SECTION HEADING */}
            <div className="projects-heading">

                <h2>My Projects</h2>

                <p>
                    Some of the applications and systems
                    I have developed.
                </p>

            </div>

            {/* LOADING */}
            {loading && (
                <p role="status">
                    Loading projects...
                </p>
            )}

            {/* ERROR */}
            {!loading && error && (
                <p role="alert">
                    {error}
                </p>
            )}

            {/* PROJECTS CONTAINER */}
            {!loading && !error && (

                <div className="projects-container">

                    {projects.length === 0 && (
                        <p>
                            No projects available yet.
                        </p>
                    )}

                    {projects.map((project) => (

                        <div
                            className="project-card"
                            key={project.id}
                        >

                            {/* PROJECT IMAGE */}
                            <div className="project-image">

                                <img
                                    src={getProjectImage(project)}
                                    alt={project.title}
                                    onError={(event) => {

                                        const img =
                                            event.currentTarget;

                                        if (
                                            !img.src.endsWith(
                                                placeholderImage
                                            )
                                        ) {
                                            img.src =
                                                placeholderImage;
                                        }

                                    }}
                                />

                            </div>

                            {/* PROJECT INFORMATION */}
                            <div className="project-info">

                                {/* TITLE */}
                                <h3>
                                    {project.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p>
                                    {project.description}
                                </p>

                                {/* TECHNOLOGIES */}
                                <div className="project-technologies">

                                    {(project.technologies || [])
                                        .map((technology) => (

                                            <span key={technology}>
                                                {technology}
                                            </span>

                                        ))}

                                </div>

                                {/* PROJECT STATUS */}
                                {project.status === "Ongoing" && (
                                    <p>
                                        Status: Ongoing
                                    </p>
                                )}

                                {/* DEMO LINK */}
                                {project.demo_url && (

                                    <a
                                        href={project.demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-button"
                                    >
                                        View Demo
                                    </a>

                                )}

                                {/* GITHUB LINK */}
                                {project.github_url && (

                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-button"
                                    >
                                        GitHub
                                    </a>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    );
}

export default Projects;