// Import Skills CSS
import "./Skills.css";

// Create Skills component
function Skills() {

    // Store skills in a JavaScript array
    const skills = [
        {
            id: 1,
            category: "Frontend Development",
            technologies: [
                "React",
                "JavaScript",
                "HTML",
                "CSS",
                "Tailwind CSS"
            ]
        },

        {
            id: 2,
            category: "Backend Development",
            technologies: [
                "PHP",
                "Laravel",
                "Node.js",
                "Express.js",
                "REST APIs"
            ]
        },

        {
            id: 3,
            category: "Databases",
            technologies: [
                "MySQL",
                "MongoDB",
                "PostgreSQL"
            ]
        },

        {
            id: 4,
            category: "Development Tools",
            technologies: [
                "Git",
                "GitHub",
                "Postman",
                "VS Code",
                "npm"
            ]
        }
    ];

    return (

        // SKILLS SECTION
        <section id="skills" className="skills-section">

            {/* SECTION HEADING */}
            <div className="skills-heading">

                <h2>My Technical Skills</h2>

                <p>
                    Technologies and tools I use
                    to develop modern web applications.
                </p>

            </div>

            {/* SKILLS CONTAINER */}
            <div className="skills-container">

                {/* Loop through skills array */}
                {skills.map((skill) => (

                    // INDIVIDUAL SKILL CARD
                    <div
                        className="skills-card"
                        key={skill.id}
                    >

                        {/* Skill Category */}
                        <h3>{skill.category}</h3>

                        {/* TECHNOLOGIES */}
                        <div className="skills-list">

                            {/* Loop through technologies */}
                            {skill.technologies.map((technology) => (

                                <span
                                    className="skill-badge"
                                    key={technology}
                                >
                                    {technology}
                                </span>

                            ))}

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

// Export Skills component
export default Skills;