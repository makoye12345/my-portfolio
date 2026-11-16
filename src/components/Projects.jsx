// Import Projects CSS
import "./Projects.css";

// Create Projects component
function Projects() {

    // Store project information in an array
    const projects = [
        {
            id: 1,
            title: "E-Library Management System",

            description:
                "A web-based system for managing book inventory, " +
                "borrowing activities, and user profiles.",

            technologies: [
                "Laravel",
                "PHP",
                "HTML",
                "CSS",
                "JavaScript",
                "MySQL"
            ],

            image: "/images/elibrary.png",

            // Project demonstration video
            demo: "https://youtu.be/kzYYdbxwXKw"
        },

        {
            id: 2,
            title: "E-Learning Management System",

            description:
                "An e-learning management system featuring " +
                "school management, scheduling, user " +
                "authentication, and cart functionality.",

            technologies: [
                "Laravel",
                "PHP",
                "HTML",
                "CSS",
                "JavaScript"
            ],

            image: "/images/elearning.png",

            // No demo link provided yet
            demo: ""
        },

        {
            id: 3,
            title: "Sales and Inventory Management System",

            description:
                "A web-based system designed to track stock " +
                "levels, sales reports, and product records.",

            technologies: [],

            image: "/images/inventory.png",

            // No demo link provided yet
            demo: ""
        }
    ];

    return (

        // PROJECTS SECTION
        <section id="projects" className="projects-section">

            {/* SECTION HEADING */}
            <div className="projects-heading">

                <h2>My Projects</h2>

                <p>
                    Some of the applications and systems
                    I have developed.
                </p>

            </div>

            {/* PROJECTS CONTAINER */}
            <div className="projects-container">

                {/* Loop through projects array */}
                {projects.map((project) => (

                    // INDIVIDUAL PROJECT CARD
                    <div
                        className="project-card"
                        key={project.id}
                    >

                        {/* PROJECT IMAGE */}
                        <div className="project-image">

                            <img
                                src={project.image}
                                alt={project.title}
                                onError={(event) => {
                                    event.currentTarget.src =
                                        "/images/project-placeholder.svg";
                                }}
                            />

                        </div>

                        {/* PROJECT INFORMATION */}
                        <div className="project-info">

                            {/* Project Title */}
                            <h3>{project.title}</h3>

                            {/* Project Description */}
                            <p>{project.description}</p>

                            {/* TECHNOLOGIES */}
                            <div className="project-technologies">

                                {project.technologies.map(
                                    (technology) => (

                                        <span key={technology}>
                                            {technology}
                                        </span>

                                    )
                                )}

                            </div>

                            {/* PROJECT DEMO LINK */}
                            {project.demo && (

                                <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-button"
                                >
                                    View Demo
                                </a>

                            )}

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

// Export Projects component
export default Projects;