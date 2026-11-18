import "./Home.css";

import {
  usePortfolioProfile,
  usePortfolioCV,
  getProfileImageUrl,
} from "../hooks/usePortfolioData";

function Home() {
  const profile = usePortfolioProfile();
  const cv = usePortfolioCV();

  return (
    <section id="home" className="home-section">

      {/* LEFT SIDE: INTRODUCTION */}
      <div className="home-info">

        {/* NAME */}
        <h1 className="home-name">
          {profile.full_name}
        </h1>

        {/* PROFESSIONAL TITLE */}
        <h2 className="home-title">
          {profile.professional_title}
        </h2>

        {/* INTRODUCTION */}
        <p
          className="home-description"
          style={{ whiteSpace: "pre-line" }}
        >
          {profile.introduction}
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
            href={cv.url}
            download={cv.download ? "Deus_Makoye_CV.pdf" : undefined}
            target={cv.download ? undefined : "_blank"}
            rel={cv.download ? undefined : "noopener noreferrer"}
            className="home-cv-button"
          >
            Download CV
          </a>

        </div>
      </div>

      {/* RIGHT SIDE: PROFILE IMAGE */}
      <div className="home-image">

        <img
          src={getProfileImageUrl(profile.image_path)}
          alt={profile.full_name}
          onError={(event) => {
            const image = event.currentTarget;

            if (!image.src.endsWith("/images/profile.png")) {
              image.src = "/images/profile.png";
            }
          }}
        />

      </div>

    </section>
  );
}

export default Home;