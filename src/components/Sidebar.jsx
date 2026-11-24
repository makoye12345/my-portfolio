import "./Sidebar.css";

import {
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

import {
  usePortfolioProfileWithLoading,
  usePortfolioContact,
  usePortfolioCV,
  getProfileImageUrl,
} from "../hooks/usePortfolioData";

function Sidebar() {
  const { profile, loading } = usePortfolioProfileWithLoading();
  const contact = usePortfolioContact();
  const cv = usePortfolioCV();

  const whatsappNumber = contact.whatsapp_number.replace(/\D/g, "");

  const menuItems = [
    { id: 1, name: "Home", link: "#home", icon: "⌂" },
    { id: 2, name: "About Me", link: "#about", icon: "◉" },
    { id: 3, name: "My Skills", link: "#skills", icon: "⚙" },
    { id: 4, name: "My Projects", link: "#projects", icon: "▣" },
    { id: 5, name: "Experience", link: "#experience", icon: "★" },
    { id: 6, name: "Contact", link: "#contact", icon: "✉" },
  ];

  return (
    <aside className="portfolio-sidebar">

      {/* PROFILE SECTION */}
      <div className="sidebar-profile">
{!loading && profile?.image_path && (
  <img
    src={getProfileImageUrl(profile.image_path)}
    alt={profile.full_name}
    className="sidebar-profile-image"
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />
)}

        <h2>{profile?.full_name}</h2>

        <p>{profile?.professional_title}</p>

      </div>

      {/* SOCIAL MEDIA ICONS */}
      <div className="sidebar-social">

        {contact.github_url && (
          <a
            href={contact.github_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        )}

        {contact.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        )}

        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
        )}

        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        )}

      </div>

      {/* NAVIGATION MENU */}
      <nav className="sidebar-navigation">

        {menuItems.map((item) => (

          <a
            key={item.id}
            href={item.link}
            className="sidebar-nav-link"
          >

            <span className="sidebar-nav-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>

          </a>

        ))}

      </nav>

      {/* DOWNLOAD CV */}
      <div className="sidebar-bottom">

        <a
          href={cv.url}
          download={cv.download ? "Deus_Makoye_CV.pdf" : undefined}
          target={cv.download ? undefined : "_blank"}
          rel={cv.download ? undefined : "noopener noreferrer"}
          className="sidebar-download"
        >
          ↓ Download CV
        </a>

      </div>

    </aside>
  );
}

export default Sidebar;