import "./Services.css";

function Services() {

    // Services offered
    const services = [
        {
            id: 1,
            icon: "💻",
            title: "Frontend Development",
            description:
                "Creating responsive, interactive, and user-friendly web interfaces."
        },
        {
            id: 2,
            icon: "⚙️",
            title: "Backend Development",
            description:
                "Developing reliable backend systems, REST APIs, and authentication."
        },
        {
            id: 3,
            icon: "🗄️",
            title: "Database Integration",
            description:
                "Connecting applications to databases and managing application data."
        },
        {
            id: 4,
            icon: "🛠️",
            title: "Web Application Development",
            description:
                "Building complete web applications and management systems."
        }
    ];

    return (
        <section className="services-section">

            {/* SECTION HEADING */}
            <h2>What I Do</h2>

            <p className="services-description">
                I develop modern web applications that help
                individuals and organizations solve real-world
                problems through technology.
            </p>

            {/* SERVICE CARDS */}
            <div className="services-grid">

                {services.map((service) => (

                    <div
                        key={service.id}
                        className="service-card"
                    >

                        <span className="service-icon">
                            {service.icon}
                        </span>

                        <h3>{service.title}</h3>

                        <p>{service.description}</p>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default Services;