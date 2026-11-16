import "./Contact.css";

function Contact() {

    // Contact information
    const contacts = [
        {
            id: 1,
            icon: "✉",
            title: "Email",
            value: "makoyedeus8@gmail.com",
            link: "mailto:makoyedeus8@gmail.com"
        },
        {
            id: 2,
            icon: "☎",
            title: "Phone",
            value: "+255612470595",
            link: "tel:+255612470595"
        },
        {
            id: 3,
            icon: "◉",
            title: "GitHub",
            value: "makoye12345",
            link: "https://github.com/makoye12345"
        },
        {
            id: 4,
            icon: "in",
            title: "LinkedIn",
            value: "Deus Makoye",
            link: "https://www.linkedin.com/in/deus-makoye972310288"
        }
    ];

    return (
        <section id="contact" className="contact-section">

            {/* Heading */}
            <div className="contact-heading">
                <h2>Contact Me</h2>
                <p>
                    Interested in working together?
                    Feel free to get in touch.
                </p>
            </div>

            {/* Contact information */}
            <div className="contact-container">

                {contacts.map((contact) => (

                    <div className="contact-card" key={contact.id}>

                        {/* Contact icon */}
                        <span className="contact-icon">
                            {contact.icon}
                        </span>

                        <div>
                            <h3>{contact.title}</h3>

                            <a
                                href={contact.link}
                                target={
                                    contact.link.startsWith("https")
                                        ? "_blank"
                                        : undefined
                                }
                                rel={
                                    contact.link.startsWith("https")
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                            >
                                {contact.value}
                            </a>
                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default Contact;