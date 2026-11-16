import "./Experience.css";

function Experience() {

    // EDUCATION DATA
    const education = [
        {
            id: 1,
            institution: "St. John's University of Tanzania",
            qualification: "Bachelor of Science in Information Technology",
            period: "October 2022 – August 2025",
            location: "Dodoma, Tanzania"
        }
    ];

    // PROFESSIONAL EXPERIENCE DATA
    const experiences = [
        {
            id: 1,
            organization: "Wipa Education Center",
            position: "ICT Teaching and Computer Maintenance",
            period: "Through 2026",
            location: "Morogoro, Tanzania",
            duties: [
                "Teaching computer science.",
                "Repairing and maintaining computers.",
                "Designing announcements using Adobe Photoshop."
            ]
        },
        {
            id: 2,
            organization: "St. John's University of Tanzania",
            position: "IT Support – Field Practical Training",
            period: "April – July 2024",
            location: "Dodoma, Tanzania",
            duties: [
                "Assisted with computer troubleshooting.",
                "Supported student and staff digital records.",
                "Participated in document digitization and system maintenance."
            ]
        }
    ];

    return (
        <section id="experience" className="experience-section">

            {/* MAIN HEADING */}
            <div className="experience-heading">
                <h2>Education & Experience</h2>
                <p>My academic and professional background</p>
            </div>

            {/* EDUCATION */}
            <div className="education-area">
                <h3>🎓 Education</h3>

                {education.map((item) => (
                    <div className="education-card" key={item.id}>
                        <span className="experience-date">
                            {item.period}
                        </span>

                        <h4>{item.qualification}</h4>
                        <h5>{item.institution}</h5>
                        <p>{item.location}</p>
                    </div>
                ))}
            </div>

            {/* PROFESSIONAL EXPERIENCE */}
            <div className="professional-area">

                <h3>💼 Professional Experience</h3>

                {/* TWO CARDS SIDE BY SIDE */}
                <div className="professional-grid">

                    {experiences.map((item) => (

                        <div
                            className="professional-card"
                            key={item.id}
                        >

                            {/* Organization */}
                            <h4>{item.organization}</h4>

                            {/* Date */}
                            <span className="experience-date">
                                {item.period}
                            </span>

                            {/* Position */}
                            <h5>{item.position}</h5>

                            {/* Location */}
                            <p>{item.location}</p>

                            {/* Responsibilities */}
                            <ul>
                                {item.duties.map((duty, index) => (
                                    <li key={index}>
                                        {duty}
                                    </li>
                                ))}
                            </ul>

                        </div>

                    ))}

                </div>
            </div>

        </section>
    );
}

export default Experience;