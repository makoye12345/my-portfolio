// Import Sidebar styling
import "./Sidebar.css";
import {
    FaGithub,
    FaLinkedinIn,
    FaWhatsapp,
    FaEnvelope
} from "react-icons/fa";

// Create Sidebar component
function Sidebar() {

    // Store navigation links in an array
    const menuItems = [
        { id: 1, name: "Home", link: "#home", icon: "⌂" },
        { id: 2, name: "About Me", link: "#about", icon: "◉" },
        { id: 3, name: "My Skills", link: "#skills", icon: "⚙" },
        { id: 4, name: "My Projects", link: "#projects", icon: "▣" },
        { id: 5, name: "Experience", link: "#experience", icon: "★" },
        { id: 6, name: "Contact", link: "#contact", icon: "✉" }
    ];

    return (
        <aside className="portfolio-sidebar">

            {/* PROFILE SECTION */}
            <div className="sidebar-profile">

                {/* Profile picture */}
                <img
                    src="images/profile.png"
                    alt="Deus Makoye"
                    className="sidebar-profile-image"
                />

                {/* Developer name */}
                <h2>Deus Makoye</h2>

                {/* Professional title */}
                <p>Full Stack Developer</p>

            </div>

           {/* SOCIAL MEDIA ICONS */}
<div className="sidebar-social">

    {/* GitHub */}
    <a
        href="https://github.com/makoye12345"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
    >
        <FaGithub />
    </a>

    {/* LinkedIn */}
    <a
        href="https://www.linkedin.com/in/deus-makoye972310288"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
    >
        <FaLinkedinIn />
    </a>

    {/* WhatsApp */}
    <a
        href="https://wa.me/255612470595"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
    >
        <FaWhatsapp />
    </a>

    {/* Email */}
    <a
        href="mailto:makoyedeus8@gmail.com"
        aria-label="Email"
    >
        <FaEnvelope />
    </a>

</div>

            {/* NAVIGATION MENU */}
            <nav className="sidebar-navigation">

                {/* Display menu items using map() */}
                {menuItems.map((item) => (

                    <a
                        key={item.id}
                        href={item.link}
                        className="sidebar-nav-link"
                    >

                        {/* Menu icon */}
                        <span className="sidebar-nav-icon">
                            {item.icon}
                        </span>

                        {/* Menu name */}
                        <span>{item.name}</span>

                    </a>

                ))}

            </nav>
            

            {/* DOWNLOAD CV */}
            <div className="sidebar-bottom">

                <a
                    href="/cv.pdf"
                    download="Deus_Makoye_CV.pdf"
                    className="sidebar-download"
                >
                    ↓ Download CV
                </a>

            </div>

        </aside>
    );
}

export default Sidebar;