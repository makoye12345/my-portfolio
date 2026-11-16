import "./About.css";

function About() {
    return (
        <section id="about" className="about-section">

            {/* SECTION HEADING */}
            <div className="about-heading">
                <h2>About Me</h2>
                <p>Get to know my professional background</p>
            </div>

            <div className="about-container">

                {/* LEFT: PROFESSIONAL BACKGROUND */}
                <div className="about-info">

                    <h3>
                        I'm Deus Makoye, a Full Stack Developer
                    </h3>

                    <p>
                        I am an Information Technology graduate
                        from St. John's University of Tanzania,
                        with a passion for software development
                        and solving real-world problems.
                    </p>

                    <p>
                        I enjoy designing and developing web
                        applications that help individuals,
                        businesses, and organizations manage
                        their activities efficiently.
                    </p>

                    <p>
                        My practical experience includes developing
                        management systems, providing IT support,
                        teaching computer science, and maintaining
                        computer systems.
                    </p>

                    <p>
                        My career goal is to contribute to
                        innovative software projects while
                        continuously improving my development
                        skills and technical knowledge.
                    </p>

                    {/* PROJECT BUTTON */}
                    <a href="#projects" className="about-button">
                        Explore My Projects
                    </a>

                </div>

                {/* RIGHT: PROFESSIONAL HIGHLIGHTS */}
                <div className="about-details">

                    {/* EDUCATION */}
                    <div className="about-card">
                        <h4>🎓 Education</h4>
                        <p>
                            Bachelor of Science in
                            Information Technology
                        </p>
                        <p>St. John's University of Tanzania</p>
                        <p>2022 – 2025</p>
                    </div>

                    {/* EXPERIENCE */}
                    <div className="about-card">
                        <h4>💼 Experience</h4>
                        <p>
                            IT Support – St. John's University
                        </p>
                        <p>
                            ICT Teaching and Computer Maintenance –
                            Wipa Education Center
                        </p>
                    </div>

                    {/* PROFESSIONAL INTERESTS */}
                    <div className="about-card">
                        <h4>🚀 Professional Interests</h4>
                        <p>Software Development</p>
                        <p>Web Application Development</p>
                        <p>Problem Solving and Technology Innovation</p>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default About;