import "./Footer.css";

function Footer() {

    // Automatically get the current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="portfolio-footer">

            <p>
                © {currentYear} Deus Makoye.
                All rights reserved.
            </p>

            <p>
                Designed & Developed by Deus Makoye
            </p>

        </footer>
    );
}

export default Footer;