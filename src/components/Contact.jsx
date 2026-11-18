import "./Contact.css";

import { usePortfolioContact } from "../hooks/usePortfolioData";

function Contact() {
  const contact = usePortfolioContact();

  const contacts = [
    {
      id: 1,
      icon: "✉",
      title: "Email",
      value: contact.email,
      link: `mailto:${contact.email}`,
    },
    {
      id: 2,
      icon: "☎",
      title: "Phone",
      value: contact.phone,
      link: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      id: 3,
      icon: "◉",
      title: "GitHub",
      value: contact.github_url
        ? contact.github_url.replace(/^https?:\/\/(www\.)?/, "")
        : "",
      link: contact.github_url,
    },
    {
      id: 4,
      icon: "in",
      title: "LinkedIn",
      value: contact.linkedin_url
        ? "View LinkedIn Profile"
        : "",
      link: contact.linkedin_url,
    },
    {
      id: 5,
      icon: "⌖",
      title: "Location",
      value: contact.location,
      link: "",
    },
  ];

  return (
    <section id="contact" className="contact-section">

      {/* HEADING */}
      <div className="contact-heading">

        <h2>Contact Me</h2>

        <p>
          Interested in working together?
          Feel free to get in touch.
        </p>

      </div>

      {/* CONTACT CARDS */}
      <div className="contact-container">

        {contacts.map((item) => (

          <div
            className="contact-card"
            key={item.id}
          >

            <span className="contact-icon">
              {item.icon}
            </span>

            <div>

              <h3>{item.title}</h3>

              {item.link ? (

                <a
                  href={item.link}
                  target={
                    item.link.startsWith("https://")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    item.link.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {item.value}
                </a>

              ) : (

                <span>{item.value}</span>

              )}

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Contact;