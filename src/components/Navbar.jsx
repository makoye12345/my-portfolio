// Import Navbar CSS
import "./Navbar.css";

// Create Navbar component
function Navbar() {
    return (
        <header className="portfolio-navbar">

            {/* Portfolio Logo */}
            <a href="#home" className="portfolio-logo">
                <span className="logo-symbol">&lt;/&gt;</span>
                <span>Deus <strong>Makoye</strong></span>
            </a>

            {/* Navigation Menu */}
            <nav className="portfolio-nav-links">

                <a href="#home">Home</a>

                <a href="#about">About</a>

                <a href="#skills">Skills</a>

                <a href="#projects">Projects</a>

                <a href="#experience">Experience</a>

                <a href="#contact">Contact</a>

            </nav>

            {/* Download CV Button */}
            <a
                href="/cv.pdf"
                download="Deus_Makoye_CV.pdf"
                className="portfolio-cv-button"
            >
                ↓ Download CV
            </a>

        </header>
    );
}

export default Navbar;