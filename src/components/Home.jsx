// Import Home CSS
import "./Home.css";

// Home Component
function Home() {
    return (
        <section id="home" className="home-section">

            {/* LEFT SIDE: INTRODUCTION */}
            <div className="home-info">

                <h1 className="home-name">
                    Deus Makoye
                </h1>

                <h2 className="home-title">
                    Full Stack Developer
                </h2>

                <p className="home-description">
                    I am a Full Stack Developer specializing in
                    building modern, responsive, and user-friendly
                    web applications.

                    I develop frontend interfaces using React,
                    JavaScript, HTML, and CSS, and backend
                    systems using PHP and Laravel.
                </p>

                {/* ACTION BUTTONS */}
                <div className="home-buttons">

                    <a
                        href="#projects"
                        className="home-project-button"
                    >
                        View Projects
                    </a>

                    <a
                        href="/cv.pdf"
                        download="Deus_Makoye_CV.pdf"
                        className="home-cv-button"
                    >
                        Download CV
                    </a>

                </div>

            </div>

            {/* RIGHT SIDE: PROFILE IMAGE */}
            <div className="home-image">

                <img
                    src="/images/profile.jpg"
                    alt="Deus Makoye"
                />

            </div>

        </section>
    );
}

export default Home;